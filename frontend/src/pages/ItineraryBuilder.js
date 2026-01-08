import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function ItineraryBuilder() {
  const [destinations, setDestinations] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchDestinations();
  }, [user, navigate]);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/destinations/');
      setDestinations(response.data);
    } catch (err) {
      setError('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const toggleDestination = (destId) => {
    setSelectedDestinations(prev => {
      if (prev.includes(destId)) {
        return prev.filter(id => id !== destId);
      } else {
        return [...prev, destId];
      }
    });
  };

  const calculateTotals = () => {
    const selected = destinations.filter(d => selectedDestinations.includes(d.destination_id));
    const totalDays = selected.reduce((sum, d) => sum + d.duration_days, 0);
    const totalCost = selected.reduce((sum, d) => sum + (d.avg_cost_per_day * d.duration_days), 0);
    return { totalDays, totalCost };
  };

  const createItinerary = async () => {
    if (selectedDestinations.length === 0) {
      setError('Please select at least one destination');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title for your itinerary');
      return;
    }

    try {
      setCreating(true);
      setError('');

      await api.post('/itineraries/create', null, {
        params: {
          title: title,
          destination_ids: selectedDestinations
        }
      });

      navigate('/my-itineraries');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create itinerary');
    } finally {
      setCreating(false);
    }
  };

  const { totalDays, totalCost } = calculateTotals();

  if (loading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f7fa'
      }}>
        <p style={{ fontSize: '18px', color: '#666' }}>Loading destinations...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', background: '#f5f7fa' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>🗺️ Build Your Itinerary</h1>
        <p style={{ margin: '10px 0 0', fontSize: '1.1rem' }}>
          Select destinations to create your perfect Nepal adventure
        </p>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        {/* Summary Card */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '10px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, fontSize: '1.5rem', color: '#333' }}>
            Your Itinerary Summary
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>
              Itinerary Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., My Nepal Adventure 2024"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '5px' }}>📍</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>
                {selectedDestinations.length}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Destinations</div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '5px' }}>📅</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>
                {totalDays}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Total Days</div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '5px' }}>💰</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>
                ${totalCost}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Estimated Cost</div>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            onClick={createItinerary}
            disabled={creating || selectedDestinations.length === 0}
            style={{
              width: '100%',
              padding: '15px',
              background: selectedDestinations.length > 0 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: selectedDestinations.length > 0 ? 'pointer' : 'not-allowed',
              fontWeight: '600',
              fontSize: '16px'
            }}
          >
            {creating ? 'Creating...' : `Create Itinerary (${selectedDestinations.length} destinations)`}
          </button>
        </div>

        {/* Destinations Grid */}
        <h2 style={{ color: '#333', marginBottom: '20px' }}>
          Select Destinations
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {destinations.map(dest => {
            const isSelected = selectedDestinations.includes(dest.destination_id);

            return (
              <div
                key={dest.destination_id}
                onClick={() => toggleDestination(dest.destination_id)}
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: isSelected ? '0 4px 12px rgba(102, 126, 234, 0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: isSelected ? '3px solid #667eea' : '3px solid transparent',
                  position: 'relative'
                }}
              >
                {/* Selected Badge */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    background: '#27ae60',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span>✓</span> Selected
                  </div>
                )}

                <div style={{
                  height: '150px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px'
                }}>
                  {dest.category === 'Trekking' && '⛰️'}
                  {dest.category === 'Cultural' && '🏛️'}
                  {dest.category === 'Religious' && '🛕'}
                  {dest.category === 'Nature' && '🌲'}
                  {dest.category === 'Wildlife' && '🐅'}
                  {dest.category === 'Adventure' && '🎢'}
                </div>

                <div style={{ padding: '15px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#333' }}>
                    {dest.name}
                  </h3>

                  <p style={{ color: '#666', fontSize: '13px', margin: '5px 0' }}>
                    📍 {dest.location}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '12px',
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    <span>📅 {dest.duration_days}d</span>
                    <span>💰 ${dest.avg_cost_per_day}/day</span>
                    <span>💪 L{dest.difficulty_level}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ItineraryBuilder;
