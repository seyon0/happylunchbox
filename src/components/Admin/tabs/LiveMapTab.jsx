import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { adminAPI } from '../../../services/api';
import { AlertOctagon, AlertTriangle, Info, Navigation } from 'lucide-react';
import L from 'leaflet';

// Leaflet icon fix
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const LiveMapTab = () => {
  const [mapData, setMapData] = useState({ alerts: [], bookings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getMapData().then(data => {
      setMapData(data);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch map data', err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-cream-200 shadow-card-elevated flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-card-elevated flex flex-col md:flex-row h-[600px]">
      {/* Sidebar for Alerts */}
      <div className="w-full md:w-1/3 bg-cream-50 border-r border-cream-200 flex flex-col h-full">
        <div className="p-5 border-b border-cream-200">
          <h3 className="font-heading text-lg font-extrabold text-ink-900 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-500" />
            Active Alerts
          </h3>
          <p className="text-xs text-stone-500 mt-1">Live updates from riders and system</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {mapData.alerts.length === 0 ? (
            <div className="text-center text-stone-400 text-xs py-10">No active alerts.</div>
          ) : (
            mapData.alerts.map(alert => (
              <div key={alert.id} className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${alert.severity === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                  {alert.severity === 'high' ? <AlertOctagon className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${alert.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`}>
                    {alert.severity} priority
                  </span>
                  <p className="font-bold text-sm text-ink-900 mt-0.5">{alert.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="w-full md:w-2/3 h-full relative z-0">
        <MapContainer center={[51.505, -0.09]} zoom={13} className="w-full h-full z-0">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {/* Alerts Markers */}
          {mapData.alerts.map(alert => (
            <Marker key={`alert-${alert.id}`} position={[alert.lat, alert.lng]}>
              <Popup>
                <div className="font-sans">
                  <div className="font-bold text-red-600 flex items-center gap-1 mb-1">
                    <AlertOctagon className="w-3 h-3" /> Alert
                  </div>
                  <div className="text-xs">{alert.message}</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Bookings Markers */}
          {mapData.bookings.map(booking => (
            <Marker key={`booking-${booking.id}`} position={[booking.lat, booking.lng]}>
              <Popup>
                <div className="font-sans">
                  <div className="font-bold text-brand-600 flex items-center gap-1 mb-1">
                    <Navigation className="w-3 h-3" /> Booking: {booking.id}
                  </div>
                  <div className="text-xs">Status: {booking.status}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
