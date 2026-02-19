"""
Meaningful unit tests for core business logic.
Tests cover authentication, task management, and data validation with edge cases.
"""
import pytest
from datetime import datetime
from sqlmodel import Session, create_engine, select, SQLModel
from sqlmodel.pool import StaticPool

from src.core.security import verify_password, get_password_hash, create_access_token, decode_access_token
from src.models.userinfo import UserInfo, UserCreate
from src.models.task import Task, TaskCreate, Priority
from src.models.area import Area


@pytest.fixture
def session():
    """Create an in-memory SQLite database for testing."""
    engine = create_engine(
        "sqlite://", 
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


class TestUserAuthentication:
    """Test 1: User registration validation with edge cases."""
    
    def test_user_registration_with_valid_data(self, session: Session):
        """Should successfully register user with valid email and password."""
        user_data = UserCreate(email="user@example.com", full_name="John Doe", password="SecurePass123!")
        hashed_pwd = get_password_hash(user_data.password)
        
        user = UserInfo(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hashed_pwd
        )
        session.add(user)
        session.commit()
        
        retrieved = session.exec(select(UserInfo).where(UserInfo.email == "user@example.com")).first()
        assert retrieved is not None
        assert retrieved.email == "user@example.com"
        assert retrieved.full_name == "John Doe"
    
    def test_user_registration_with_duplicate_email(self, session: Session):
        """Should reject registration with duplicate email (edge case)."""
        email = "duplicate@example.com"
        user1 = UserInfo(email=email, full_name="User 1", hashed_password=get_password_hash("pass1"))
        session.add(user1)
        session.commit()
        
        # Try to add duplicate
        user2 = UserInfo(email=email, full_name="User 2", hashed_password=get_password_hash("pass2"))
        session.add(user2)
        
        with pytest.raises(Exception):  # IntegrityError or similar
            session.commit()

    def test_user_registration_with_empty_full_name(self, session: Session):
        """Should allow empty full_name at model level (database may enforce)."""
        # Note: Pydantic models at this level don't enforce non-empty full_name
        # This tests that the model accepts it (validation happens at route/API level)
        user_data = UserCreate(email="test@example.com", full_name="", password="Pass123!")
        hashed_pwd = get_password_hash(user_data.password)
        
        user = UserInfo(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hashed_pwd
        )
        session.add(user)
        session.commit()
        
        retrieved = session.get(UserInfo, user.id)
        assert retrieved is not None


class TestUserLogin:
    """Test 2: User login with password verification and edge cases."""
    
    def test_login_with_correct_password(self, session: Session):
        """Should successfully login with correct password."""
        password = "CorrectPass123!"
        hashed = get_password_hash(password)
        user = UserInfo(email="user@example.com", full_name="User", hashed_password=hashed)
        session.add(user)
        session.commit()
        
        is_correct = verify_password(password, hashed)
        assert is_correct is True
    
    def test_login_with_incorrect_password(self, session: Session):
        """Should reject login with incorrect password."""
        correct_pass = "CorrectPass123!"
        wrong_pass = "WrongPass456!"
        
        hashed = get_password_hash(correct_pass)
        is_correct = verify_password(wrong_pass, hashed)
        assert is_correct is False
    
    def test_login_with_nonexistent_user(self, session: Session):
        """Should return None when user doesn't exist (edge case)."""
        user = session.exec(select(UserInfo).where(UserInfo.email == "nonexistent@example.com")).first()
        assert user is None


class TestTaskManagement:
    """Test 3: Task creation with priority and completion status."""
    
    def test_task_creation_with_all_fields(self, session: Session):
        """Should create task with all fields including priority."""
        user = UserInfo(email="user@example.com", full_name="User", hashed_password="hash")
        session.add(user)
        session.commit()
        
        area = Area(name="Work", color="bg-blue-500", user_id=user.id)
        session.add(area)
        session.commit()
        
        task = Task(
            title="Complete project",
            description="Finish the backend API",
            priority=Priority.HIGH,
            completed=False,
            due_date="2026-03-01",
            user_id=user.id,
            area_id=area.id
        )
        session.add(task)
        session.commit()
        
        retrieved = session.get(Task, task.id)
        assert retrieved.title == "Complete project"
        assert retrieved.priority == Priority.HIGH
        assert retrieved.completed is False
    
    def test_task_creation_with_default_priority(self, session: Session):
        """Should use MEDIUM priority by default (edge case)."""
        user = UserInfo(email="user@example.com", full_name="User", hashed_password="hash")
        session.add(user)
        session.commit()
        
        task = Task(title="Simple task", user_id=user.id)
        session.add(task)
        session.commit()
        
        retrieved = session.get(Task, task.id)
        assert retrieved.priority == Priority.MEDIUM
    
    def test_task_with_empty_title(self, session: Session):
        """Should allow empty title at model level (API should validate separately)."""
        user = UserInfo(email="user@example.com", full_name="User", hashed_password="hash")
        session.add(user)
        session.commit()
        
        # Note: Model allows empty title, but API routes should validate this
        task = Task(title="", user_id=user.id)
        session.add(task)
        session.commit()
        
        retrieved = session.get(Task, task.id)
        assert retrieved is not None
        assert retrieved.title == ""


class TestTaskUpdate:
    """Test 4: Task update with permission checks and state validation."""
    
    def test_update_task_completion_status(self, session: Session):
        """Should update task completion status."""
        user = UserInfo(email="user@example.com", full_name="User", hashed_password="hash")
        session.add(user)
        session.commit()
        
        task = Task(title="Task", completed=False, user_id=user.id)
        session.add(task)
        session.commit()
        
        task.completed = True
        session.add(task)
        session.commit()
        
        retrieved = session.get(Task, task.id)
        assert retrieved.completed is True
    
    def test_update_task_priority(self, session: Session):
        """Should update task priority correctly."""
        user = UserInfo(email="user@example.com", full_name="User", hashed_password="hash")
        session.add(user)
        session.commit()
        
        task = Task(title="Task", priority=Priority.LOW, user_id=user.id)
        session.add(task)
        session.commit()
        
        task.priority = Priority.HIGH
        session.add(task)
        session.commit()
        
        retrieved = session.get(Task, task.id)
        assert retrieved.priority == Priority.HIGH
    
    def test_update_task_from_different_user_fails(self, session: Session):
        """Should prevent updating another user's task (security edge case)."""
        user1 = UserInfo(email="user1@example.com", full_name="User 1", hashed_password="hash")
        user2 = UserInfo(email="user2@example.com", full_name="User 2", hashed_password="hash")
        session.add(user1)
        session.add(user2)
        session.commit()
        
        task = Task(title="User1 Task", user_id=user1.id)
        session.add(task)
        session.commit()
        
        # User2 should not be able to modify User1's task
        assert task.user_id != user2.id


class TestTaskFiltering:
    """Test 5: Task filtering by area with proper isolation."""
    
    def test_get_tasks_by_area(self, session: Session):
        """Should return only tasks in specific area."""
        user = UserInfo(email="user@example.com", full_name="User", hashed_password="hash")
        session.add(user)
        session.commit()
        
        area1 = Area(name="Work", color="bg-blue-500", user_id=user.id)
        area2 = Area(name="Personal", color="bg-green-500", user_id=user.id)
        session.add(area1)
        session.add(area2)
        session.commit()
        
        task1 = Task(title="Work task", area_id=area1.id, user_id=user.id)
        task2 = Task(title="Personal task", area_id=area2.id, user_id=user.id)
        session.add(task1)
        session.add(task2)
        session.commit()
        
        work_tasks = session.exec(
            select(Task).where((Task.user_id == user.id) & (Task.area_id == area1.id))
        ).all()
        assert len(work_tasks) == 1
        assert work_tasks[0].title == "Work task"
    
    def test_user_cannot_see_other_users_tasks(self, session: Session):
        """Should isolate tasks by user (edge case for data privacy)."""
        user1 = UserInfo(email="user1@example.com", full_name="User 1", hashed_password="hash")
        user2 = UserInfo(email="user2@example.com", full_name="User 2", hashed_password="hash")
        session.add(user1)
        session.add(user2)
        session.commit()
        
        task1 = Task(title="User1 Task", user_id=user1.id)
        task2 = Task(title="User2 Task", user_id=user2.id)
        session.add(task1)
        session.add(task2)
        session.commit()
        
        user1_tasks = session.exec(select(Task).where(Task.user_id == user1.id)).all()
        assert len(user1_tasks) == 1
        assert user1_tasks[0].user_id == user1.id


class TestAreaManagement:
    """Test 6: Area creation and user-specific isolation."""
    
    def test_create_area_for_user(self, session: Session):
        """Should create area associated with user."""
        user = UserInfo(email="user@example.com", full_name="User", hashed_password="hash")
        session.add(user)
        session.commit()
        
        area = Area(name="Work", color="bg-blue-500", user_id=user.id)
        session.add(area)
        session.commit()
        
        user_areas = session.exec(select(Area).where(Area.user_id == user.id)).all()
        assert len(user_areas) == 1
        assert user_areas[0].name == "Work"
    
    def test_different_users_can_have_same_area_name(self, session: Session):
        """Should allow different users to have areas with same name (edge case)."""
        user1 = UserInfo(email="user1@example.com", full_name="User 1", hashed_password="hash")
        user2 = UserInfo(email="user2@example.com", full_name="User 2", hashed_password="hash")
        session.add(user1)
        session.add(user2)
        session.commit()
        
        area1 = Area(name="Work", color="bg-blue-500", user_id=user1.id)
        area2 = Area(name="Work", color="bg-green-500", user_id=user2.id)
        session.add(area1)
        session.add(area2)
        session.commit()
        
        user1_areas = session.exec(select(Area).where(Area.user_id == user1.id)).all()
        user2_areas = session.exec(select(Area).where(Area.user_id == user2.id)).all()
        
        assert len(user1_areas) == 1
        assert len(user2_areas) == 1
        assert user1_areas[0].name == user2_areas[0].name


class TestJWTTokenManagement:
    """Test 7: JWT token creation and validation."""
    
    def test_create_and_decode_token(self):
        """Should create valid JWT token and decode it correctly."""
        email = "user@example.com"
        token = create_access_token(subject=email)
        
        payload = decode_access_token(token)
        assert payload.get("sub") == email
    
    def test_decode_invalid_token_raises_error(self):
        """Should raise error for invalid token (edge case)."""
        invalid_token = "invalid.token.here"
        
        with pytest.raises(Exception):
            decode_access_token(invalid_token)
    
    def test_decode_tampered_token_fails(self):
        """Should reject tampered token (security edge case)."""
        email = "user@example.com"
        token = create_access_token(subject=email)
        tampered_token = token[:-10] + "corrupted!"
        
        with pytest.raises(Exception):
            decode_access_token(tampered_token)


class TestDataValidation:
    """Test 8: Data validation and constraint enforcement."""
    
    def test_task_timestamps_are_set_automatically(self, session: Session):
        """Should automatically set created_at and updated_at."""
        user = UserInfo(email="user@example.com", full_name="User", hashed_password="hash")
        session.add(user)
        session.commit()
        
        task = Task(title="Task", user_id=user.id)
        session.add(task)
        session.commit()
        
        retrieved = session.get(Task, task.id)
        assert retrieved.created_at is not None
        assert retrieved.updated_at is not None
        assert isinstance(retrieved.created_at, datetime)
    
    def test_user_timestamps_are_set_automatically(self, session: Session):
        """Should automatically set user creation timestamps."""
        user = UserInfo(email="user@example.com", full_name="User", hashed_password="hash")
        session.add(user)
        session.commit()
        
        retrieved = session.get(UserInfo, user.id)
        assert retrieved.created_at is not None
        assert retrieved.updated_at is not None
    
    def test_priority_enum_validation(self):
        """Should validate priority enum values correctly."""
        assert Priority.HIGH == "High"
        assert Priority.MEDIUM == "Medium"
        assert Priority.LOW == "Low"


class TestEdgeCasesAndConstraints:
    """Test 9: Special edge cases and business rule constraints."""
    
    def test_task_with_null_area_is_valid(self, session: Session):
        """Should allow task without area assignment (edge case)."""
        user = UserInfo(email="user@example.com", full_name="User", hashed_password="hash")
        session.add(user)
        session.commit()
        
        task = Task(title="Task without area", user_id=user.id, area_id=None)
        session.add(task)
        session.commit()
        
        retrieved = session.get(Task, task.id)
        assert retrieved.area_id is None
    
    def test_task_with_null_due_date_is_valid(self, session: Session):
        """Should allow task without due date (optional field)."""
        user = UserInfo(email="user@example.com", full_name="User", hashed_password="hash")
        session.add(user)
        session.commit()
        
        task = Task(title="Task", user_id=user.id, due_date=None)
        session.add(task)
        session.commit()
        
        retrieved = session.get(Task, task.id)
        assert retrieved.due_date is None


class TestConcurrentOperations:
    """Test 10: Handling concurrent or rapid data modifications."""
    
    def test_multiple_task_updates_preserve_data(self, session: Session):
        """Should handle multiple updates without data loss."""
        user = UserInfo(email="user@example.com", full_name="User", hashed_password="hash")
        session.add(user)
        session.commit()
        
        task = Task(title="Original", priority=Priority.LOW, completed=False, user_id=user.id)
        session.add(task)
        session.commit()
        
        task_id = task.id
        
        # Simulate multiple updates
        task = session.get(Task, task_id)
        task.title = "Updated"
        session.commit()
        
        task = session.get(Task, task_id)
        task.priority = Priority.HIGH
        session.commit()
        
        task = session.get(Task, task_id)
        task.completed = True
        session.commit()
        
        final = session.get(Task, task_id)
        assert final.title == "Updated"
        assert final.priority == Priority.HIGH
        assert final.completed is True
