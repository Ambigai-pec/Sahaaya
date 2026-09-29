from abc import ABC, abstractmethod
from typing import Generic, TypeVar, List, Optional, Any

T = TypeVar("T")

class BaseRepository(ABC, Generic[T]):
    """
    Abstract Base Repository interface defining CRUD and query methods.
    Enables switching from SQLAlchemy SQLite to MongoDB (Motor/Beanie) or Firebase (Firestore)
    without modifying core domain services or route contracts.
    """
    @abstractmethod
    def get_by_id(self, id: Any) -> Optional[T]:
        pass

    @abstractmethod
    def get_all(self, **kwargs) -> List[T]:
        pass

    @abstractmethod
    def create(self, entity: T) -> T:
        pass

    @abstractmethod
    def update(self, id: Any, entity_data: dict) -> Optional[T]:
        pass

    @abstractmethod
    def delete(self, id: Any) -> bool:
        pass
