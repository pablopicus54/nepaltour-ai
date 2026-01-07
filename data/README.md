# Nepal Destinations Dataset

This directory contains the comprehensive dataset of Nepal tourist destinations used for the ML recommendation system.

## Dataset Structure

### File: `destinations.csv`

**Current Status:** 25 destinations (Target: 150+ for production)

### Fields Description

| Field | Type | Description |
|-------|------|-------------|
| destination_id | Integer | Unique identifier (Primary Key) |
| name | String | Destination name |
| location | String | District/region in Nepal |
| latitude | Float | Latitude coordinates for mapping |
| longitude | Float | Longitude coordinates for mapping |
| category | String | Main category (Trekking, Cultural, Religious, Nature, Wildlife, Adventure) |
| description | Text | Detailed description (200-300 words) |
| activities | JSON Array | List of available activities |
| difficulty_level | Integer (1-5) | Physical difficulty (1=Easy, 5=Expert) |
| best_season | String | Optimal visiting season |
| avg_cost_per_day | Integer | Average daily cost in USD |
| duration_days | Integer | Recommended stay duration |
| popularity_score | Integer (1-100) | Destination popularity rating |
| altitude | Integer | Elevation in meters above sea level |
| permits_required | Boolean | Whether special permits are needed |
| image_url | String | URL to destination image |

## Categories Breakdown

Current distribution:
- **Trekking:** 8 destinations (Everest BC, Annapurna Circuit, Langtang, Manaslu, etc.)
- **Cultural:** 6 destinations (Durbar Squares, traditional towns)
- **Religious:** 5 destinations (Lumbini, Pashupatinath, Boudhanath, etc.)
- **Nature:** 4 destinations (Pokhara, Rara Lake, Nagarkot, Ilam)
- **Wildlife:** 3 destinations (Chitwan, Bardiya, Koshi Tappu)
- **Adventure:** Various (integrated within other categories)

## Geographic Coverage

- **Western Nepal:** Rara Lake, Bardiya, Pokhara
- **Central Nepal:** Kathmandu Valley, Nagarkot, Langtang
- **Eastern Nepal:** Everest region, Koshi Tappu, Ilam
- **Far Western:** Upper Mustang
- **Terai (Plains):** Lumbini, Chitwan, Janakpur

## Data Sources

- Nepal Tourism Board official website
- UNESCO World Heritage Site listings
- TripAdvisor Nepal reviews and data
- Wikipedia articles on Nepal tourism
- Google Maps for coordinates
- Travel blogs (WelcomeNepal, etc.)

## Usage

This dataset will be:
1. Loaded into PostgreSQL database
2. Used for training the ML recommendation model (KNN + Content-Based Filtering)
3. Displayed on the interactive map
4. Used for itinerary generation

## Future Expansion

To reach the target of 150+ destinations, we will add:
- More hidden gems and off-beat destinations
- Regional cultural sites
- Adventure sports locations
- Wellness and yoga retreats
- New trekking routes
- Lesser-known national parks and conservation areas
