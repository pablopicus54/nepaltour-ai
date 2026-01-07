from app.models.user import User
from app.models.preference import UserPreference
from app.models.destination import Destination
from app.models.recommendation import Recommendation
from app.models.itinerary import Itinerary
from app.models.review import Review
from app.models.admin import AdminUser

__all__ = [
    "User",
    "UserPreference",
    "Destination",
    "Recommendation",
    "Itinerary",
    "Review",
    "AdminUser",
]
