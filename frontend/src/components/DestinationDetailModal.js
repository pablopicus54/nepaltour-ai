import React from 'react';

function DestinationDetailModal({ destination, onClose }) {
  if (!destination) return null;

  const getCategoryEmoji = (category) => {
    const emojis = {
      'Trekking': '⛰️',
      'Cultural': '🏛️',
      'Religious': '🛕',
      'Nature': '🌲',
      'Wildlife': '🐅',
      'Adventure': '🎢'
    };
    return emojis[category] || '📍';
  };

  const getDifficultyLabel = (level) => {
    const labels = {
      1: 'Very Easy',
      2: 'Easy',
      3: 'Moderate',
      4: 'Challenging',
      5: 'Very Challenging'
    };
    return labels[level] || 'Unknown';
  };

  const getDifficultyColor = (level) => {
    const colors = {
      1: '#27ae60',
      2: '#2ecc71',
      3: '#f39c12',
      4: '#e67e22',
      5: '#e74c3c'
    };
    return colors[level] || '#95a5a6';
  };

  // Parse activities if they're stored as JSON string
  const activities = typeof destination.activities === 'string'
    ? JSON.parse(destination.activities)
    : destination.activities || [];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}
    onClick={onClose}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            zIndex: 10
          }}
        >
          ×
        </button>

        {/* Header with gradient */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px 30px',
          borderRadius: '15px 15px 0 0',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '15px' }}>
            {getCategoryEmoji(destination.category)}
          </div>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>{destination.name}</h2>
          <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>
            📍 {destination.location}
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          {/* Quick Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>🏷️</div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Category</div>
              <div style={{ fontWeight: '600', color: '#333' }}>{destination.category}</div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>💪</div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Difficulty</div>
              <div style={{ fontWeight: '600', color: getDifficultyColor(destination.difficulty_level) }}>
                {getDifficultyLabel(destination.difficulty_level)}
              </div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>💵</div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Cost/Day</div>
              <div style={{ fontWeight: '600', color: '#333' }}>${destination.avg_cost_per_day}</div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>📅</div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Duration</div>
              <div style={{ fontWeight: '600', color: '#333' }}>{destination.duration_days} days</div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>☀️</div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Best Season</div>
              <div style={{ fontWeight: '600', color: '#333' }}>{destination.best_season}</div>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>⛰️</div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Altitude</div>
              <div style={{ fontWeight: '600', color: '#333' }}>{destination.altitude}m</div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              color: '#333',
              marginBottom: '15px',
              fontSize: '1.3rem',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              About
            </h3>
            <p style={{
              color: '#555',
              lineHeight: '1.8',
              fontSize: '15px'
            }}>
              {destination.description}
            </p>
          </div>

          {/* Activities */}
          {activities.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                color: '#333',
                marginBottom: '15px',
                fontSize: '1.3rem',
                borderBottom: '2px solid #667eea',
                paddingBottom: '10px'
              }}>
                Activities
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {activities.map((activity, index) => (
                  <span
                    key={index}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div style={{
            background: destination.permits_required ? '#fff3cd' : '#d1ecf1',
            padding: '15px',
            borderRadius: '10px',
            border: `1px solid ${destination.permits_required ? '#ffc107' : '#17a2b8'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>
                {destination.permits_required ? '⚠️' : 'ℹ️'}
              </span>
              <div>
                <strong style={{ color: '#333' }}>
                  {destination.permits_required ? 'Permits Required' : 'No Special Permits'}
                </strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                  {destination.permits_required
                    ? 'You will need to obtain necessary permits before visiting this destination.'
                    : 'This destination can be visited without special permits.'}
                </p>
              </div>
            </div>
          </div>

          {/* Popularity Score */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
              Popularity Score
            </div>
            <div style={{
              background: '#f8f9fa',
              borderRadius: '10px',
              overflow: 'hidden',
              height: '8px',
              position: 'relative'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                width: `${destination.popularity_score}%`,
                height: '100%',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: '14px', color: '#333', marginTop: '5px', fontWeight: '600' }}>
              {destination.popularity_score}/100
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetailModal;
