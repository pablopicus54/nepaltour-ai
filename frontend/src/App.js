import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Destinations from './pages/Destinations';
import Map from './pages/Map';
import PreferenceWizard from './pages/PreferenceWizard';
import Recommendations from './pages/Recommendations';
import ItineraryBuilder from './pages/ItineraryBuilder';
import MyItineraries from './pages/MyItineraries';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/map" element={<Map />} />
            <Route path="/preferences" element={<PreferenceWizard />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/itinerary-builder" element={<ItineraryBuilder />} />
            <Route path="/my-itineraries" element={<MyItineraries />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
