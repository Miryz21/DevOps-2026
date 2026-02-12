from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from src.core.database import get_session
from src.models.userinfo import UserInfo
from src.models.area import Area, AreaCreate, AreaPublic, AreaUpdate
from src.routes.user import get_current_user

router = APIRouter()


@router.post("/areas/", response_model=AreaPublic)
def create_area(
    *,
    session: Session = Depends(get_session),
    area_in: AreaCreate,
    current_user: UserInfo = Depends(get_current_user),
):
    area = Area.from_orm(area_in, update={"user_id": current_user.id})
    session.add(area)
    session.commit()
    session.refresh(area)
    return area


@router.get("/areas/", response_model=list[AreaPublic])
def read_areas(
    *,
    session: Session = Depends(get_session),
    offset: int = 0,
    limit: int = 100,
    current_user: UserInfo = Depends(get_current_user),
):
    areas = session.exec(
        select(Area)
        .where(Area.user_id == current_user.id)
        .offset(offset)
        .limit(limit)
    ).all()
    return areas


@router.get("/areas/{area_id}", response_model=AreaPublic)
def read_area(
    *,
    session: Session = Depends(get_session),
    area_id: int,
    current_user: UserInfo = Depends(get_current_user),
):
    area = session.get(Area, area_id)
    if not area or area.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Area not found")
    return area


@router.patch("/areas/{area_id}", response_model=AreaPublic)
def update_area(
    *,
    session: Session = Depends(get_session),
    area_id: int,
    area_in: AreaUpdate,
    current_user: UserInfo = Depends(get_current_user),
):
    area = session.get(Area, area_id)
    if not area or area.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Area not found")
    update_data = area_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(area, key, value)
    session.add(area)
    session.commit()
    session.refresh(area)
    return area


@router.delete("/areas/{area_id}")
def delete_area(
    *,
    session: Session = Depends(get_session),
    area_id: int,
    current_user: UserInfo = Depends(get_current_user),
):
    area = session.get(Area, area_id)
    if not area or area.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Area not found")
    session.delete(area)
    session.commit()
    return {"ok": True}
