import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Home() {
  const [stats, setStats] = useState({
    totalDestinations: 102,
    categories: 6,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/destinations/');
        setStats({
          totalDestinations: response.data.length,
          categories: 6,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3.5rem', margin: 0, marginBottom: '20px' }}>
          Discover Nepal with AI
        </h1>
        <p style={{ fontSize: '1.3rem', marginBottom: '40px', opacity: 0.9 }}>
          Intelligent Personalized Tourism Recommendations
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/destinations">
            <button style={{
              padding: '15px 40px',
              fontSize: '1.1rem',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              Explore Destinations
            </button>
          </Link>

          <Link to="/register">
            <button style={{
              padding: '15px 40px',
              fontSize: '1.1rem',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* Statistics Section */}
      <div style={{
        background: 'white',
        padding: '50px 20px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          textAlign: 'center'
        }}>
          <StatCard number={stats.totalDestinations} label="Destinations" icon="🏔️" />
          <StatCard number="6" label="Categories" icon="📂" />
          <StatCard number="100+" label="Activities" icon="⛷️" />
          <StatCard number="24/7" label="AI Support" icon="🤖" />
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px'
      }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '50px', color: '#333' }}>
          Why NepalTourAI?
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px'
        }}>
          <FeatureCard
            icon="🤖"
            title="AI-Powered Recommendations"
            description="Get personalized destination suggestions based on your preferences using advanced machine learning algorithms."
          />
          <FeatureCard
            icon="🗺️"
            title="Interactive Maps"
            description="Explore Nepal's destinations on an interactive map with detailed information and beautiful imagery."
          />
          <FeatureCard
            icon="📅"
            title="Smart Itinerary Planning"
            description="Automatically generate optimized travel itineraries with cost estimates and activity suggestions."
          />
          <FeatureCard
            icon="🏔️"
            title="100+ Destinations"
            description="Discover hidden gems and popular attractions across Nepal's diverse landscapes and cultures - from Everest to Lumbini."
          />
          <FeatureCard
            icon="💰"
            title="Budget Planning"
            description="Filter destinations by budget, difficulty, and season to find the perfect match for your trip."
          />
          <FeatureCard
            icon="⭐"
            title="User Reviews"
            description="Read authentic reviews and ratings from travelers to make informed decisions."
          />
        </div>
      </div>

      {/* Categories Showcase */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '60px 20px',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '50px' }}>
            Explore by Category
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '25px'
          }}>
            <CategoryCard icon="⛰️" title="Trekking" count="35+" description="Epic mountain adventures" />
            <CategoryCard icon="🏛️" title="Cultural" count="15+" description="Rich heritage sites" />
            <CategoryCard icon="🛕" title="Religious" count="15+" description="Sacred pilgrimage" />
            <CategoryCard icon="🌲" title="Nature" count="20+" description="Scenic landscapes" />
            <CategoryCard icon="🐅" title="Wildlife" count="8+" description="Exotic fauna" />
            <CategoryCard icon="🎢" title="Adventure" count="25+" description="Thrilling activities" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: '#f5f7fa',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}>
          Ready to Explore Nepal?
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
          Create your account and get personalized travel recommendations today
        </p>
        <Link to="/register">
          <button style={{
            padding: '15px 50px',
            fontSize: '1.1rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            Create Free Account
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#333',
        color: 'white',
        padding: '30px 20px',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0 }}>
          © 2025 NepalTourAI - Final Year Project by Rabin Pandey
        </p>
        <p style={{ margin: '10px 0 0', fontSize: '14px', opacity: 0.8 }}>
          Lincoln University College, Malaysia
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      textAlign: 'center',
      transition: 'transform 0.2s'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{icon}</div>
      <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#333' }}>{title}</h3>
      <p style={{ color: '#666', lineHeight: '1.6' }}>{description}</p>
    </div>
  );
}

function StatCard({ number, label, icon }) {
  return (
    <div style={{
      padding: '20px',
      transition: 'transform 0.2s'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{icon}</div>
      <div style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#667eea',
        marginBottom: '5px'
      }}>
        {number}
      </div>
      <div style={{
        fontSize: '1rem',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: '500'
      }}>
        {label}
      </div>
    </div>
  );
}

function CategoryCard({ icon, title, count, description }) {
  return (
    <Link to="/destinations" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        padding: '30px',
        borderRadius: '15px',
        textAlign: 'center',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
      }}
      >
        <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>{icon}</div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '5px', fontWeight: '600' }}>{title}</h3>
        <div style={{ fontSize: '1.2rem', marginBottom: '10px', opacity: 0.9 }}>{count}</div>
        <p style={{ fontSize: '0.95rem', opacity: 0.85, margin: 0 }}>{description}</p>
      </div>
    </Link>
  );
}

export default Home;
