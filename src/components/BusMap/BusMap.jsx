import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from '@react-google-maps/api';
import io from 'socket.io-client';
import './style.css';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 7.8731,
  lng: 80.7718,
};

export default function BusMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [busMarkers, setBusMarkers] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [directions, setDirections] = useState(null);
  const [eta, setEta] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const destination = { lat: 7.95, lng: 80.8 }; // Example fixed destination

  // --- Socket.IO setup ---
  useEffect(() => {
    const socket = io('https://bus-tracker-production-93a5.up.railway.app', {
      transports: ['websocket'],
      auth: { token: localStorage.getItem('token') },
    });
    // Replace with your backend URL

    socket.on('connect', () => {
      console.log('Connected to backend for live locations');
    });

    // Listen for live driver locations
    socket.on('driverLocation', (data) => {
      const { id, lat, lng } = data;

      setBusMarkers((prev) => {
        const existing = prev.find((bus) => bus.id === id);
        if (existing) {
          return prev.map((bus) =>
            bus.id === id ? { ...bus, lat, lng } : bus
          );
        } else {
          return [...prev, { id, lat, lng }];
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Auto-select first bus when map is ready
  useEffect(() => {
    if (mapLoaded && busMarkers.length > 0 && !selectedBus) {
      setSelectedBus(busMarkers[0]);
    }
  }, [mapLoaded, busMarkers]);

  // Get directions and ETA when selected bus changes
  useEffect(() => {
    if (!selectedBus || !window.google || !window.google.maps) return;

    const loadDirections = () => {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: { lat: selectedBus.lat, lng: selectedBus.lng },
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            setDirections(result);
            const leg = result.routes[0].legs[0];
            setEta({
              duration: leg.duration.text,
              distance: leg.distance.text,
            });
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
    };

    if (!window.google.maps.DirectionsService) {
      const retry = setTimeout(loadDirections, 500);
      return () => clearTimeout(retry);
    } else {
      loadDirections();
    }
  }, [selectedBus]);

  return (
    <div className="map-wrapper">
      <LoadScript
        googleMapsApiKey={apiKey}
        onLoad={() => setMapLoaded(true)}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={8}
          mapContainerClassName="map-container"
        >
          {busMarkers.map((bus) => (
            <Marker
              key={bus.id}
              position={{ lat: bus.lat, lng: bus.lng }}
              label={`Bus ${bus.id}`}
              onClick={() => setSelectedBus(bus)}
            />
          ))}

          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>

      {eta && selectedBus && (
        <div className="eta-box">
          <h4>🚌 ETA for Bus {selectedBus.id}</h4>
          <p>Distance: {eta.distance}</p>
          <p>Estimated Time: {eta.duration}</p>
        </div>
      )}
    </div>
  );
}
