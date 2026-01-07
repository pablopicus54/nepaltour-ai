import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    difficulty: ''
  });

  useEffect(() => {
    fetchDestinations();
  }, [filters]);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);

      const response = await api.get(`/destinations/?${params.toString()}`);
      setDestinations(response.data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Trekking', 'Cultural', 'Religious', 'Nature', 'Wildlife', 'Adventure'];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Explore Nepal</h1>
        <p style={{ margin: '10px 0 0', fontSize: '1.1rem' }}>{destinations.length} Amazing Destinations</p>
      </div>

      {/* Filters */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>Filters</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search destinations..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}
            />

            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                background: 'white'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                background: 'white'
              }}
            >
              <option value="">All Difficulty</option>
              <option value="1">Easy</option>
              <option value="2">Moderate</option>
              <option value="3">Challenging</option>
              <option value="4">Difficult</option>
              <option value="5">Expert</option>
            </select>

            <button
              onClick={() => setFilters({ category: '', search: '', difficulty: '' })}
              style={{
                padding: '10px 20px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Destinations Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>Loading destinations...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '25px'
          }}>
            {destinations.map(dest => (
              <div
                key={dest.destination_id}
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  height: '200px',
                  background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '48px'
                }}>
                  {dest.category === 'Trekking' && '⛰️'}
                  {dest.category === 'Cultural' && '🏛️'}
                  {dest.category === 'Religious' && '🛕'}
                  {dest.category === 'Nature' && '🌲'}
                  {dest.category === 'Wildlife' && '🐅'}
                  {dest.category === 'Adventure' && '🎢'}
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '10px'
                  }}>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#333' }}>{dest.name}</h3>
                    <span style={{
                      background: '#667eea',
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {dest.category}
                    </span>
                  </div>

                  <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>
                    📍 {dest.location}
                  </p>

                  <p style={{
                    color: '#555',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    margin: '15px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {dest.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '15px',
                    marginTop: '15px',
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    <span>💪 Level {dest.difficulty_level}</span>
                    <span>💰 ${dest.avg_cost_per_day}/day</span>
                    <span>📅 {dest.duration_days}d</span>
                  </div>

                  <div style={{
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid #eee',
                    fontSize: '12px',
                    color: '#888'
                  }}>
                    Best season: <strong>{dest.best_season}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && destinations.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '50px',
            background: 'white',
            borderRadius: '10px'
          }}>
            <p style={{ fontSize: '18px', color: '#666' }}>No destinations found</p>
            <button
              onClick={() => setFilters({ category: '', search: '', difficulty: '' })}
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Destinations;
