from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional


class RawLead:
    """Standardized DTO produced by any BaseCollector before pipeline enrichment."""
    def __init__(
        self,
        name: str,
        category: Optional[str] = None,
        address: Optional[str] = None,
        city: Optional[str] = None,
        state: Optional[str] = None,
        phone: Optional[str] = None,
        website: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        rating: Optional[float] = None,
        reviews_count: Optional[int] = None,
        maps_url: Optional[str] = None,
        collector_source: str = "unknown"
    ):
        self.name = name
        self.category = category
        self.address = address
        self.city = city
        self.state = state
        self.phone = phone
        self.website = website
        self.latitude = latitude
        self.longitude = longitude
        self.rating = rating
        self.reviews_count = reviews_count
        self.maps_url = maps_url
        self.collector_source = collector_source

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "category": self.category,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "phone": self.phone,
            "website": self.website,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "rating": self.rating,
            "reviews_count": self.reviews_count,
            "maps_url": self.maps_url,
            "collector_source": self.collector_source,
        }


class BaseCollector(ABC):
    """Abstract interface for all data collectors in AcheAqui."""
    name: str = "base"

    @abstractmethod
    async def search(
        self, 
        query: str, 
        city: Optional[str] = None, 
        state: Optional[str] = None, 
        limit: int = 20
    ) -> List[RawLead]:
        """Search for businesses given query, city, state, and limit."""
        pass
