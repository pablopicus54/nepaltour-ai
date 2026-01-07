# Database Schema Documentation

## Overview

NepalTourAI uses PostgreSQL with SQLAlchemy ORM for data management. The schema consists of 7 main tables supporting user management, preferences, destinations, recommendations, itineraries, reviews, and admin functionality.

## Tables

### 1. users
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | SERIAL | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| full_name | VARCHAR(255) | | User's full name |
| country | VARCHAR(100) | | User's country |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation timestamp |

### 2. user_preferences
Stores user travel preferences for personalized recommendations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| preference_id | SERIAL | PRIMARY KEY | Unique preference ID |
| user_id | INTEGER | FOREIGN KEY | References users(user_id) |
| interests | JSONB | | Interest scores (e.g., {"adventure": 8, "cultural": 6}) |
| budget_range | VARCHAR(50) | | "budget", "mid-range", or "luxury" |
| fitness_level | INTEGER | | 1-5 scale |
| travel_style | VARCHAR(50) | | "solo", "couple", "family", "group" |
| preferred_seasons | JSONB | | Array of seasons (e.g., ["spring", "autumn"]) |
| duration_days | INTEGER | | Preferred trip duration |
| difficulty_preference | INTEGER | | 1-5 scale |

### 3. destinations
Complete information about Nepal tourist destinations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| destination_id | SERIAL | PRIMARY KEY | Unique destination ID |
| name | VARCHAR(255) | NOT NULL | Destination name |
| location | VARCHAR(255) | | District/region |
| latitude | DECIMAL(10,8) | | GPS latitude |
| longitude | DECIMAL(11,8) | | GPS longitude |
| category | VARCHAR(100) | | Main category |
| description | TEXT | | Detailed description |
| activities | JSONB | | Array of available activities |
| difficulty_level | INTEGER | | 1-5 scale |
| best_season | VARCHAR(50) | | Optimal visiting season |
| avg_cost_per_day | INTEGER | | Average daily cost (USD) |
| duration_days | INTEGER | | Recommended stay duration |
| popularity_score | INTEGER | | 1-100 rating |
| altitude | INTEGER | | Elevation in meters |
| permits_required | BOOLEAN | | Special permits needed |
| image_url | VARCHAR(500) | | Image URL |

### 4. recommendations
Stores ML-generated recommendations for users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| recommendation_id | SERIAL | PRIMARY KEY | Unique recommendation ID |
| user_id | INTEGER | FOREIGN KEY | References users(user_id) |
| destination_id | INTEGER | FOREIGN KEY | References destinations(destination_id) |
| score | DECIMAL(5,4) | | ML similarity score (0-1) |
| created_at | TIMESTAMP | DEFAULT NOW() | Generation timestamp |

### 5. itineraries
User-created travel itineraries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| itinerary_id | SERIAL | PRIMARY KEY | Unique itinerary ID |
| user_id | INTEGER | FOREIGN KEY | References users(user_id) |
| title | VARCHAR(255) | | Itinerary title |
| destinations | JSONB | | Array of destination objects with days |
| total_days | INTEGER | | Total trip duration |
| total_cost | INTEGER | | Estimated total cost (USD) |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

### 6. reviews
User reviews and ratings for destinations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| review_id | SERIAL | PRIMARY KEY | Unique review ID |
| user_id | INTEGER | FOREIGN KEY | References users(user_id) |
| destination_id | INTEGER | FOREIGN KEY | References destinations(destination_id) |
| rating | INTEGER | CHECK (1-5) | Star rating (1-5) |
| comment | TEXT | | Review text |
| created_at | TIMESTAMP | DEFAULT NOW() | Review timestamp |

### 7. admin_users
Administrator accounts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| admin_id | SERIAL | PRIMARY KEY | Unique admin ID |
| username | VARCHAR(100) | UNIQUE, NOT NULL | Admin username |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| role | VARCHAR(50) | DEFAULT 'admin' | Admin role |

## Entity Relationships

```
users (1) ──< (M) user_preferences
users (1) ──< (M) recommendations ──> (1) destinations
users (1) ──< (M) itineraries
users (1) ──< (M) reviews ──> (1) destinations
```

## Indexes

- users: email (unique index)
- destinations: name, category
- admin_users: username (unique index)

## Initialization

Run the initialization script to create tables and load data:

```bash
cd backend
python init_db.py
```

This will:
1. Create all tables
2. Load destinations from CSV
3. Create default admin user (username: admin, password: admin123)

## Database Connection

Configure in `.env` file:
```
DATABASE_URL=postgresql://username:password@localhost:5432/nepaltour_ai
```
