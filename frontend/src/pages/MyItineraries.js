import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function MyItineraries() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchItineraries();
  }, [user, navigate]);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/itineraries/my-itineraries');
      setItineraries(response.data);
    } catch (err) {
      console.error('Error fetching itineraries:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteItinerary = async (itineraryId) => {
    if (!window.confirm('Are you sure you want to delete this itinerary?')) {
      return;
    }

    try {
      setDeleting(itineraryId);
      await api.delete(`/itineraries/${itineraryId}`);
      setItineraries(prev => prev.filter(i => i.itinerary_id !== itineraryId));
      if (selectedItinerary?.itinerary_id === itineraryId) {
        setSelectedItinerary(null);
      }
    } catch (err) {
      alert('Failed to delete itinerary');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f7fa'
      }}>
        <p style={{ fontSize: '18px', color: '#666' }}>Loading your itineraries...</p>
      </div>
    );
  }

  if (itineraries.length === 0) {
    return (
      <div style={{ minHeight: 'calc(100vh - 60px)', background: '#f5f7fa' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>🗺️ My Itineraries</h1>
        </div>

        <div style={{
          maxWidth: '600px',
          margin: '50px auto',
          padding: '40px',
          background: 'white',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📋</div>
          <h2 style={{ color: '#333', marginBottom: '15px' }}>No Itineraries Yet</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            Start planning your Nepal adventure by creating your first itinerary!
          </p>
          <button
            onClick={() => navigate('/itinerary-builder')}
            style={{
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px'
            }}
          >
            Create Your First Itinerary
          </button>
        </div>
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
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>🗺️ My Itineraries</h1>
        <p style={{ margin: '10px 0 0', fontSize: '1.1rem' }}>
          {itineraries.length} saved trip{itineraries.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        {/* Create New Button */}
        <div style={{ marginBottom: '30px', textAlign: 'right' }}>
          <button
            onClick={() => navigate('/itinerary-builder')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px'
            }}
          >
            + Create New Itinerary
          </button>
        </div>

        {/* Itineraries Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedItinerary ? '1fr 400px' : '1fr',
          gap: '20px'
        }}>
          {/* Itineraries List */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: selectedItinerary ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {itineraries.map(itinerary => {
              const isSelected = selectedItinerary?.itinerary_id === itinerary.itinerary_id;

              return (
                <div
                  key={itinerary.itinerary_id}
                  style={{
                    background: 'white',
                    borderRadius: '10px',
                    padding: '25px',
                    boxShadow: isSelected ? '0 4px 12px rgba(102, 126, 234, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #667eea' : '2px solid transparent',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setSelectedItinerary(itinerary)}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '15px'
                  }}>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#333' }}>
                      {itinerary.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItinerary(itinerary.itinerary_id);
                      }}
                      disabled={deleting === itinerary.itinerary_id}
                      style={{
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      {deleting === itinerary.itinerary_id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>

                  <p style={{ fontSize: '13px', color: '#888', marginBottom: '15px' }}>
                    Created on {formatDate(itinerary.created_at)}
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '10px',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      background: '#f8f9fa',
                      padding: '12px',
                      borderRadius: '6px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', marginBottom: '5px' }}>📍</div>
                      <div style={{ fontSize: '18px', fontWeight: '600', color: '#667eea' }}>
                        {itinerary.destinations.length}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>Destinations</div>
                    </div>

                    <div style={{
                      background: '#f8f9fa',
                      padding: '12px',
                      borderRadius: '6px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', marginBottom: '5px' }}>📅</div>
                      <div style={{ fontSize: '18px', fontWeight: '600', color: '#667eea' }}>
                        {itinerary.total_days}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>Days</div>
                    </div>

                    <div style={{
                      background: '#f8f9fa',
                      padding: '12px',
                      borderRadius: '6px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', marginBottom: '5px' }}>💰</div>
                      <div style={{ fontSize: '18px', fontWeight: '600', color: '#667eea' }}>
                        ${itinerary.total_cost}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>Total</div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItinerary(itinerary);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: isSelected ? '#667eea' : '#f8f9fa',
                      color: isSelected ? 'white' : '#667eea',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    {isSelected ? 'Viewing Details' : 'View Details'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          {selectedItinerary && (
            <div style={{
              background: 'white',
              borderRadius: '10px',
              padding: '25px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: 'fit-content',
              position: 'sticky',
              top: '20px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '20px'
              }}>
                <h3 style={{ margin: 0, color: '#333', fontSize: '1.2rem' }}>
                  Itinerary Details
                </h3>
                <button
                  onClick={() => setSelectedItinerary(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ×
                </button>
              </div>

              <h2 style={{ color: '#667eea', marginBottom: '10px' }}>
                {selectedItinerary.title}
              </h2>

              <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
                Created on {formatDate(selectedItinerary.created_at)}
              </p>

              <div style={{
                marginBottom: '25px',
                paddingBottom: '25px',
                borderBottom: '2px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    <strong>Duration:</strong> {selectedItinerary.total_days} days
                  </span>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    <strong>Cost:</strong> ${selectedItinerary.total_cost}
                  </span>
                </div>
              </div>

              <h4 style={{ color: '#333', marginBottom: '15px' }}>Day-by-Day Plan:</h4>

              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {selectedItinerary.destinations.map((dest, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '15px',
                      padding: '15px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      borderLeft: '4px solid #667eea'
                    }}
                  >
                    <div style={{
                      fontSize: '12px',
                      color: '#667eea',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      Day {dest.start_day}{dest.start_day !== dest.end_day && ` - ${dest.end_day}`}
                    </div>

                    <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '1rem' }}>
                      {dest.name}
                    </h4>

                    <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>
                      📍 {dest.location}
                    </p>

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '8px',
                      flexWrap: 'wrap',
                      fontSize: '11px',
                      color: '#666'
                    }}>
                      <span>📅 {dest.duration_days} days</span>
                      <span>💰 ${dest.cost}</span>
                      <span>💪 Level {dest.difficulty_level}</span>
                      {dest.altitude && <span>⛰️ {dest.altitude}m</span>}
                    </div>

                    {dest.activities && dest.activities.length > 0 && (
                      <div style={{ marginTop: '10px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '5px', color: '#555' }}>
                          Activities:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                          {dest.activities.map((activity, i) => (
                            <span
                              key={i}
                              style={{
                                background: '#667eea',
                                color: 'white',
                                padding: '3px 8px',
                                borderRadius: '10px',
                                fontSize: '10px'
                              }}
                            >
                              {activity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                style={{
                  width: '100%',
                  marginTop: '20px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
                onClick={() => alert('PDF export coming soon!')}
              >
                📄 Export as PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyItineraries;
