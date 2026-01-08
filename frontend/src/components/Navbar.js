import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '15px 30px',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#667eea',
          textDecoration: 'none'
        }}>
          🏔️ NepalTourAI
        </Link>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/destinations" style={{
            color: '#333',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Destinations
          </Link>

          <Link to="/map" style={{
            color: '#333',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Map
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/recommendations" style={{
                color: '#333',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Recommendations
              </Link>

              <Link to="/my-itineraries" style={{
                color: '#333',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                My Itineraries
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <>
              <span style={{ color: '#666' }}>
                Welcome, {user?.full_name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 20px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Login
              </Link>
              <Link to="/register">
                <button style={{
                  padding: '8px 20px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
