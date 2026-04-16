import unittest
import pytest
from unittest.mock import patch, Mock
from fastapi import HTTPException


def test_constants_patch_and_types():
    import src.core.constants as constants

    # Patch constants to verify they can be overridden and are string-typed
    with patch.object(constants, "AREA_NOT_FOUND", "AREA_X"):
        with patch.object(constants, "NOTE_NOT_FOUND", "NOTE_X"):
            with patch.object(constants, "TASK_NOT_FOUND", "TASK_X"):
                assert constants.AREA_NOT_FOUND == "AREA_X"
                assert isinstance(constants.AREA_NOT_FOUND, str)
                assert "AREA" in constants.AREA_NOT_FOUND


def test_read_area_uses_area_constant(monkeypatch):
    # Ensure route raises HTTPException with the patched AREA_NOT_FOUND message
    monkeypatch.setenv("DUMMY", "1")
    monkeypatch.setenv("ANOTHER", "2")
    monkeypatch.setattr("src.core.constants.AREA_NOT_FOUND", "MY_AREA_NOT_FOUND", raising=False)

    from src.routes.area import read_area
    from src.models.userinfo import UserInfo

    mock_session = Mock()
    mock_session.get.return_value = None
    user = UserInfo(id=1, email="a@x.com", full_name="A")

    with pytest.raises(HTTPException) as exc:
        read_area(session=mock_session, area_id=123, current_user=user)

    assert exc.value.detail == "MY_AREA_NOT_FOUND"


def test_read_note_uses_note_constant(monkeypatch):
    monkeypatch.setattr("src.core.constants.NOTE_NOT_FOUND", "MY_NOTE_NOT_FOUND", raising=False)

    from src.routes.note import read_note
    from src.models.userinfo import UserInfo

    mock_session = Mock()
    mock_session.get.return_value = None
    user = UserInfo(id=1, email="a@x.com", full_name="A")

    with pytest.raises(HTTPException) as exc:
        read_note(session=mock_session, note_id=5, current_user=user)

    assert exc.value.detail == "MY_NOTE_NOT_FOUND"


def test_read_task_uses_task_constant(monkeypatch):
    monkeypatch.setattr("src.core.constants.TASK_NOT_FOUND", "MY_TASK_NOT_FOUND", raising=False)

    from src.routes.task import read_task
    from src.models.userinfo import UserInfo

    mock_session = Mock()
    mock_session.get.return_value = None
    user = UserInfo(id=1, email="a@x.com", full_name="A")

    with pytest.raises(HTTPException) as exc:
        read_task(session=mock_session, task_id=7, current_user=user)

    assert exc.value.detail == "MY_TASK_NOT_FOUND"
