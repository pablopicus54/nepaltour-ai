"""
Database initialization script
Creates all tables and optionally loads sample data
"""
import csv
import json
from pathlib import Path
from app.database import engine, Base, SessionLocal
from app.models import (
    User, UserPreference, Destination, Recommendation,
    Itinerary, Review, AdminUser
)


def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully!")


def load_destinations_from_csv():
    """Load destinations from CSV file into database"""
    print("\nLoading destinations from CSV...")

    csv_path = Path(__file__).parent.parent / "data" / "destinations.csv"

    if not csv_path.exists():
        print(f"Warning: CSV file not found at {csv_path}")
        return

    db = SessionLocal()
    try:
        # Clear existing destinations
        db.query(Destination).delete()
        db.commit()

        count = 0
        with open(csv_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                # Parse JSON fields
                activities = json.loads(row['activities']) if row['activities'] else []

                destination = Destination(
                    destination_id=int(row['destination_id']),
                    name=row['name'],
                    location=row['location'],
                    latitude=float(row['latitude']),
                    longitude=float(row['longitude']),
                    category=row['category'],
                    description=row['description'],
                    activities=activities,
                    difficulty_level=int(row['difficulty_level']),
                    best_season=row['best_season'],
                    avg_cost_per_day=int(row['avg_cost_per_day']),
                    duration_days=int(row['duration_days']),
                    popularity_score=int(row['popularity_score']),
                    altitude=int(row['altitude']),
                    permits_required=row['permits_required'].lower() == 'true',
                    image_url=row['image_url']
                )
                db.add(destination)
                count += 1

        db.commit()
        print(f"✓ Loaded {count} destinations successfully!")

    except Exception as e:
        print(f"Error loading destinations: {e}")
        db.rollback()
    finally:
        db.close()


def create_admin_user():
    """Create default admin user"""
    print("\nCreating default admin user...")

    db = SessionLocal()
    try:
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

        # Check if admin exists
        existing = db.query(AdminUser).filter(AdminUser.username == "admin").first()
        if existing:
            print("Admin user already exists")
            return

        admin = AdminUser(
            username="admin",
            password_hash=pwd_context.hash("admin123"),  # Change in production!
            role="admin"
        )
        db.add(admin)
        db.commit()
        print("✓ Admin user created (username: admin, password: admin123)")
        print("  ⚠️  IMPORTANT: Change the password in production!")

    except Exception as e:
        print(f"Error creating admin: {e}")
        db.rollback()
    finally:
        db.close()


def main():
    """Main initialization function"""
    print("=" * 50)
    print("NepalTourAI Database Initialization")
    print("=" * 50)

    # Create tables
    create_tables()

    # Load data
    load_destinations_from_csv()

    # Create admin
    create_admin_user()

    print("\n" + "=" * 50)
    print("Database initialization complete!")
    print("=" * 50)


if __name__ == "__main__":
    main()
