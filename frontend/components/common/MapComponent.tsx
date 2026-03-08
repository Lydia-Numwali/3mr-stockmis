"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents, useMap } from "react-leaflet";
import { Icon as LeafletIcon } from "leaflet";

// Create a custom marker icon
const createCustomIcon = () => {
  return new LeafletIcon({
    iconUrl: "/svgs/school.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Component to handle map clicks
const MapClickHandler = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

interface MapComponentProps {
  center: [number, number];
  selectedLocation: { lat: number; lng: number } | null;
  onLocationSelect: (lat: number, lng: number) => void;
  mapKey: number;
  showSearch?: boolean;
}

// Component to handle map center updates from search
const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 13, { animate: true });
    }
  }, [map, center]);
  
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  selectedLocation,
  onLocationSelect,
  mapKey,
  showSearch = false, // Changed default to false since search will be outside
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);

  // Update map center when center prop changes
  useEffect(() => {
    setMapCenter(center);
  }, [center]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        key={mapKey}
        center={mapCenter}
        zoom={13}
        className="w-full h-full"
        zoomControl={true}
        whenReady={() => {
          console.log("Map is ready");
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapController center={mapCenter} />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={createCustomIcon()}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
