from typing import Optional, TYPE_CHECKING
from datetime import datetime

from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from src.models.area import Area


class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[str] = None
    completed: bool = False


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    area_id: Optional[int] = Field(default=None, foreign_key="area.id")
    user_id: Optional[int] = Field(default=None, foreign_key="user_info.id")
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"onupdate": datetime.utcnow},
        nullable=False,
    )

    area: Optional["Area"] = Relationship(back_populates="tasks")


class TaskCreate(TaskBase):
    area_id: Optional[int] = None


class TaskPublic(TaskBase):
    id: int
    area_id: Optional[int]
    created_at: datetime
    updated_at: datetime


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[str] = None
    completed: Optional[bool] = None
    area_id: Optional[int] = None
