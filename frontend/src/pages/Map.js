import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import DestinationDetailModal from '../components/DestinationDetailModal';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icons for different categories
const createCustomIcon = (category) => {
  const colors = {
    'Trekking': '#e74c3c',
    'Cultural': '#3498db',
    'Religious': '#9b59b6',
    'Nature': '#27ae60',
    'Wildlife': '#f39c12',
    'Adventure': '#e67e22'
  };

  const color = colors[category] || '#95a5a6';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

function Map() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Nepal center coordinates
  const nepalCenter = [28.3949, 84.1240];

  useEffect(() => {
    fetchDestinations();
  }, [selectedCategory]);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const params = selectedCategory ? `?category=${selectedCategory}` : '';
      const response = await api.get(`/destinations/${params}`);
      setDestinations(response.data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Trekking', 'Cultural', 'Religious', 'Nature', 'Wildlife', 'Adventure'];

  return (
    <div style={{ height: 'calc(100vh - 60px)', position: 'relative' }}>
      {/* Category Filter Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        background: 'white',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        maxWidth: '250px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem' }}>
          🗺️ Nepal Destinations Map
        </h3>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' }}>
            Filter by Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '13px', color: '#666' }}>
          <strong>{destinations.length}</strong> destinations on map
        </div>

        {/* Legend */}
        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Legend:</div>
          {categories.map(cat => {
            const colors = {
              'Trekking': '#e74c3c',
              'Cultural': '#3498db',
              'Religious': '#9b59b6',
              'Nature': '#27ae60',
              'Wildlife': '#f39c12',
              'Adventure': '#e67e22'
            };
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', fontSize: '11px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: colors[cat],
                  marginRight: '8px'
                }}></div>
                <span>{cat}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map */}
      {loading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: '#f5f7fa'
        }}>
          <p style={{ fontSize: '18px', color: '#666' }}>Loading map...</p>
        </div>
      ) : (
        <MapContainer
          center={nepalCenter}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {destinations.map(dest => {
            if (!dest.latitude || !dest.longitude) return null;

            return (
              <Marker
                key={dest.destination_id}
                position={[parseFloat(dest.latitude), parseFloat(dest.longitude)]}
                icon={createCustomIcon(dest.category)}
              >
                <Popup maxWidth={300}>
                  <div style={{ padding: '10px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#333' }}>
                      {dest.name}
                    </h3>

                    <div style={{
                      background: '#667eea',
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      display: 'inline-block',
                      marginBottom: '10px'
                    }}>
                      {dest.category}
                    </div>

                    <p style={{ color: '#666', fontSize: '13px', margin: '8px 0' }}>
                      📍 {dest.location}
                    </p>

                    <p style={{
                      fontSize: '13px',
                      lineHeight: '1.5',
                      color: '#555',
                      margin: '10px 0',
                      maxHeight: '100px',
                      overflow: 'auto'
                    }}>
                      {dest.description.substring(0, 150)}...
                    </p>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      fontSize: '12px',
                      marginTop: '10px',
                      paddingTop: '10px',
                      borderTop: '1px solid #eee'
                    }}>
                      <div>
                        <strong>Difficulty:</strong> Level {dest.difficulty_level}
                      </div>
                      <div>
                        <strong>Cost:</strong> ${dest.avg_cost_per_day}/day
                      </div>
                      <div>
                        <strong>Duration:</strong> {dest.duration_days} days
                      </div>
                      <div>
                        <strong>Season:</strong> {dest.best_season}
                      </div>
                    </div>

                    {dest.altitude && (
                      <div style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
                        ⛰️ Altitude: {dest.altitude}m
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedDestination(dest)}
                      style={{
                        width: '100%',
                        marginTop: '12px',
                        padding: '8px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '13px'
                      }}
                    >
                      View Full Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}

      {/* Destination Detail Modal */}
      <DestinationDetailModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
      />
    </div>
  );
}

export default Map;
