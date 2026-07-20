import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

export const Step1_SignupForm = ({ formData, setFormData, onNext }) => {
  const [position, setPosition] = useState(formData.geoPin || null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!position) {
      alert("Please select your kitchen's location on the map.");
      return;
    }
    setFormData(prev => ({ ...prev, geoPin: position }));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-2 uppercase tracking-wider">Business Name</label>
          <input 
            type="text" 
            name="businessName"
            required
            value={formData.businessName || ''}
            onChange={handleChange}
            placeholder="e.g. Jaffna Kitchen Ltd" 
            className="w-full p-4 bg-cream-50 border border-cream-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-brand-500 transition-colors" 
          />
        </div>
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-2 uppercase tracking-wider">Owner Name</label>
          <input 
            type="text" 
            name="ownerName"
            required
            value={formData.ownerName || ''}
            onChange={handleChange}
            placeholder="Jane Doe" 
            className="w-full p-4 bg-cream-50 border border-cream-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-brand-500 transition-colors" 
          />
        </div>
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-2 uppercase tracking-wider">Point of Contact / Designation</label>
          <input 
            type="text" 
            name="pocNameDesignation"
            required
            value={formData.pocNameDesignation || ''}
            onChange={handleChange}
            placeholder="Jane Doe, Head Chef" 
            className="w-full p-4 bg-cream-50 border border-cream-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-brand-500 transition-colors" 
          />
        </div>
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-2 uppercase tracking-wider">Contact Number</label>
          <input 
            type="tel" 
            name="contactNumber"
            required
            value={formData.contactNumber || ''}
            onChange={handleChange}
            placeholder="+44 7700..." 
            className="w-full p-4 bg-cream-50 border border-cream-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-brand-500 transition-colors" 
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-stone-700 block mb-2 uppercase tracking-wider">Physical Address</label>
          <input 
            type="text" 
            name="address"
            required
            value={formData.address || ''}
            onChange={handleChange}
            placeholder="123 Food Street, London, NW1 6XE" 
            className="w-full p-4 bg-cream-50 border border-cream-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-brand-500 transition-colors" 
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-stone-700 block mb-2 uppercase tracking-wider">Kitchen Location (Map Pin)</label>
        <p className="text-xs text-stone-500 font-medium mb-3">Tap on the map to drop a pin precisely where your kitchen is located. This helps riders find you.</p>
        <div className="h-64 w-full rounded-xl overflow-hidden border border-cream-200 shadow-sm relative z-0">
          <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-heading font-black text-sm uppercase tracking-wider shadow-md transition-all mt-8"
      >
        Save & Continue
      </button>
    </form>
  );
};
