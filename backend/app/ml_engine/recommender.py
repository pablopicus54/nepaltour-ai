"""
ML-based Recommendation Engine for NepalTourAI
Implements hybrid approach: KNN + Content-Based Filtering (TF-IDF)
"""
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Tuple
from sqlalchemy.orm import Session

from app.models.destination import Destination


class TourismRecommender:
    """Hybrid recommendation system using KNN and TF-IDF"""

    def __init__(self):
        self.knn_model = None
        self.scaler = StandardScaler()
        self.tfidf_vectorizer = TfidfVectorizer(stop_words='english', max_features=500)
        self.tfidf_matrix = None
        self.destinations_df = None
        self.is_trained = False

    def prepare_features(self, destinations: List[Destination]) -> pd.DataFrame:
        """Convert destination objects to feature dataframe"""

        data = []
        for dest in destinations:
            # Category encoding
            category_encoding = {
                'Trekking': [1, 0, 0, 0, 0, 0],
                'Cultural': [0, 1, 0, 0, 0, 0],
                'Religious': [0, 0, 1, 0, 0, 0],
                'Nature': [0, 0, 0, 1, 0, 0],
                'Wildlife': [0, 0, 0, 0, 1, 0],
                'Adventure': [0, 0, 0, 0, 0, 1]
            }
            cat_features = category_encoding.get(dest.category, [0, 0, 0, 0, 0, 0])

            # Season encoding
            season_encoding = {
                'Spring': [1, 0, 0, 0, 0],
                'Summer': [0, 1, 0, 0, 0],
                'Autumn': [0, 0, 1, 0, 0],
                'Winter': [0, 0, 0, 1, 0],
                'All': [1, 1, 1, 1, 1]
            }
            season_features = season_encoding.get(dest.best_season, [0, 0, 0, 0, 0])

            feature_row = {
                'destination_id': dest.destination_id,
                'name': dest.name,
                'category': dest.category,
                'description': dest.description or "",
                'difficulty_level': dest.difficulty_level or 2,
                'avg_cost_per_day': dest.avg_cost_per_day or 40,
                'popularity_score': dest.popularity_score or 50,
                'altitude': (dest.altitude or 1000) / 1000,  # Normalize
                'permits_required': 1 if dest.permits_required else 0,
                # Category one-hot encoding
                'cat_trekking': cat_features[0],
                'cat_cultural': cat_features[1],
                'cat_religious': cat_features[2],
                'cat_nature': cat_features[3],
                'cat_wildlife': cat_features[4],
                'cat_adventure': cat_features[5],
                # Season one-hot encoding
                'season_spring': season_features[0],
                'season_summer': season_features[1],
                'season_autumn': season_features[2],
                'season_winter': season_features[3],
                'season_all': season_features[4],
            }
            data.append(feature_row)

        return pd.DataFrame(data)

    def train(self, db: Session):
        """Train the recommendation models"""

        # Get all destinations
        destinations = db.query(Destination).all()

        if len(destinations) == 0:
            raise ValueError("No destinations found in database")

        # Prepare features
        self.destinations_df = self.prepare_features(destinations)

        # Features for KNN
        knn_features = [
            'difficulty_level', 'avg_cost_per_day', 'popularity_score',
            'altitude', 'permits_required',
            'cat_trekking', 'cat_cultural', 'cat_religious',
            'cat_nature', 'cat_wildlife', 'cat_adventure',
            'season_spring', 'season_summer', 'season_autumn',
            'season_winter', 'season_all'
        ]

        X = self.destinations_df[knn_features].values

        # Scale features
        X_scaled = self.scaler.fit_transform(X)

        # Train KNN
        self.knn_model = NearestNeighbors(
            n_neighbors=min(10, len(destinations)),
            metric='euclidean'
        )
        self.knn_model.fit(X_scaled)

        # Train TF-IDF on descriptions
        descriptions = self.destinations_df['description'].fillna('').tolist()
        self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(descriptions)

        self.is_trained = True
        print(f"✓ ML models trained on {len(destinations)} destinations")

    def get_recommendations(
        self,
        user_preferences: Dict,
        db: Session,
        n_recommendations: int = 10
    ) -> List[Tuple[int, str, float]]:
        """Generate recommendations based on user preferences"""

        if not self.is_trained:
            self.train(db)

        # Build user feature vector
        interests = user_preferences.get('interests', {})
        budget_map = {'budget': 30, 'mid-range': 50, 'luxury': 100}
        budget = budget_map.get(user_preferences.get('budget_range', 'mid-range'), 50)

        # Category preferences
        category_scores = {
            'Trekking': interests.get('adventure', 5),
            'Cultural': interests.get('cultural', 5),
            'Religious': interests.get('religious', 5),
            'Nature': interests.get('nature', 5),
            'Wildlife': interests.get('wildlife', 5),
            'Adventure': interests.get('adventure', 5)
        }

        # Normalize category scores
        max_cat = max(category_scores.values())
        category_one_hot = [score / max_cat if max_cat > 0 else 0.5 for score in category_scores.values()]

        # Season preferences
        preferred_seasons = user_preferences.get('preferred_seasons', ['Spring', 'Autumn'])
        season_one_hot = [
            1 if 'Spring' in preferred_seasons else 0,
            1 if 'Summer' in preferred_seasons else 0,
            1 if 'Autumn' in preferred_seasons else 0,
            1 if 'Winter' in preferred_seasons else 0,
            1  # All seasons always acceptable
        ]

        user_features = [
            user_preferences.get('difficulty_preference', 2),
            budget,
            50,  # Neutral popularity preference
            2,  # Neutral altitude (2000m)
            0,  # Permits OK
        ] + category_one_hot + season_one_hot

        # KNN-based recommendations
        user_vector_scaled = self.scaler.transform([user_features])
        distances, indices = self.knn_model.kneighbors(user_vector_scaled, n_neighbors=n_recommendations * 2)

        knn_scores = 1 / (1 + distances[0])  # Convert distance to similarity

        # Content-based recommendations (TF-IDF)
        # Build user interest description
        interest_keywords = []
        for interest, score in interests.items():
            if score >= 7:
                interest_keywords.extend([interest] * 3)
            elif score >= 5:
                interest_keywords.extend([interest] * 2)
            elif score >= 3:
                interest_keywords.append(interest)

        user_description = ' '.join(interest_keywords) if interest_keywords else "tourism travel nepal"
        user_tfidf = self.tfidf_vectorizer.transform([user_description])
        content_scores = cosine_similarity(user_tfidf, self.tfidf_matrix)[0]

        # Hybrid scoring (60% KNN, 40% Content)
        hybrid_scores = {}
        for idx, knn_idx in enumerate(indices[0]):
            dest_id = self.destinations_df.iloc[knn_idx]['destination_id']
            knn_score = knn_scores[idx]
            content_score = content_scores[knn_idx]

            # Hybrid formula
            final_score = 0.6 * knn_score + 0.4 * content_score

            # Apply budget filter
            dest_cost = self.destinations_df.iloc[knn_idx]['avg_cost_per_day']
            if dest_cost > budget * 1.5:  # Allow 50% over budget
                final_score *= 0.7

            # Apply difficulty filter
            dest_difficulty = self.destinations_df.iloc[knn_idx]['difficulty_level']
            user_fitness = user_preferences.get('fitness_level', 3)
            if dest_difficulty > user_fitness + 1:
                final_score *= 0.8

            hybrid_scores[knn_idx] = final_score

        # Sort by score and get top N
        sorted_indices = sorted(hybrid_scores.keys(), key=lambda x: hybrid_scores[x], reverse=True)
        top_indices = sorted_indices[:n_recommendations]

        # Prepare results
        recommendations = []
        for idx in top_indices:
            dest_id = int(self.destinations_df.iloc[idx]['destination_id'])
            dest_name = self.destinations_df.iloc[idx]['name']
            score = float(hybrid_scores[idx])
            recommendations.append((dest_id, dest_name, score))

        return recommendations


# Global recommender instance
recommender = TourismRecommender()
