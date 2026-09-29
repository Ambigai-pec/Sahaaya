from typing import Type, TypeVar, List, Optional, Any
from sqlalchemy.orm import Session
from .base import BaseRepository

T = TypeVar("T")

class SQLAlchemyRepository(BaseRepository[T]):
    """
    SQLAlchemy implementation of the BaseRepository for SQLite prototype.
    """
    def __init__(self, model_class: Type[T], session: Session):
        self.model_class = model_class
        self.session = session

    def get_by_id(self, id: Any) -> Optional[T]:
        return self.session.query(self.model_class).filter(getattr(self.model_class, "id") == id).first()

    def get_all(self, **kwargs) -> List[T]:
        query = self.session.query(self.model_class)
        for key, val in kwargs.items():
            if hasattr(self.model_class, key):
                query = query.filter(getattr(self.model_class, key) == val)
        return query.all()

    def create(self, entity: T) -> T:
        self.session.add(entity)
        self.session.commit()
        self.session.refresh(entity)
        return entity

    def update(self, id: Any, entity_data: dict) -> Optional[T]:
        entity = self.get_by_id(id)
        if not entity:
            return None
        for key, val in entity_data.items():
            if hasattr(entity, key):
                setattr(entity, key, val)
        self.session.commit()
        self.session.refresh(entity)
        return entity

    def delete(self, id: Any) -> bool:
        entity = self.get_by_id(id)
        if not entity:
            return False
        self.session.delete(entity)
        self.session.commit()
        return True
