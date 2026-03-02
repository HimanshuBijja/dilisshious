"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Crosshair } from "lucide-react";

// Fix Leaflet default icon issue in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationMapProps {
  onSelect: (lat: number, lng: number, address?: string) => void;
  initialLat?: number;
  initialLng?: number;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    return data.display_name || "";
  } catch {
    return "";
  }
}

export default function LocationMap({ onSelect, initialLat, initialLng }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [locating, setLocating] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const updateMarker = useCallback(
    async (lat: number, lng: number) => {
      if (!leafletMap.current) return;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], {
          icon: defaultIcon,
          draggable: true,
        }).addTo(leafletMap.current);

        markerRef.current.on("dragend", async () => {
          const pos = markerRef.current!.getLatLng();
          const address = await reverseGeocode(pos.lat, pos.lng);
          onSelect(pos.lat, pos.lng, address);
        });
      }

      const address = await reverseGeocode(lat, lng);
      onSelect(lat, lng, address);
    },
    [onSelect]
  );

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const defaultLat = initialLat || 17.385;
    const defaultLng = initialLng || 78.4867;

    const map = L.map(mapRef.current, {
      center: [defaultLat, defaultLng],
      zoom: initialLat ? 16 : 12,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    leafletMap.current = map;
    setMapReady(true);

    // Click to place pin
    map.on("click", (e: L.LeafletMouseEvent) => {
      updateMarker(e.latlng.lat, e.latlng.lng);
    });

    // If initial coords, place marker
    if (initialLat && initialLng) {
      updateMarker(initialLat, initialLng);
    }

    return () => {
      map.remove();
      leafletMap.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocateMe = useCallback(() => {
    if (!leafletMap.current || !mapReady) return;
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        leafletMap.current?.flyTo([latitude, longitude], 16, { duration: 1.5 });
        await updateMarker(latitude, longitude);
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert("Unable to get your location. Please allow location access or place a pin manually.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [mapReady, updateMarker]);

  return (
    <div className="relative">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-[350px] rounded-xl overflow-hidden border-2 border-[#f0e6d8] shadow-sm"
        style={{ zIndex: 1 }}
      />

      {/* Center Pin overlay (before marker is placed) */}
      {!markerRef.current && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-[10] pointer-events-none">
          <MapPin size={36} className="text-[#c8956c] drop-shadow-lg" />
        </div>
      )}

      {/* Locate Me button */}
      <button
        onClick={handleLocateMe}
        disabled={locating}
        className="absolute top-3 right-3 z-[10] bg-white px-3 py-2 rounded-lg shadow-md border border-[#f0e6d8] flex items-center gap-1.5 text-xs font-semibold text-[#2d2016] hover:bg-[#fdf8f3] transition-all disabled:opacity-60"
      >
        <Crosshair size={14} className={locating ? "animate-pulse text-[#c8956c]" : "text-[#c8956c]"} />
        {locating ? "Locating..." : "Use My Location"}
      </button>

      <p className="text-[10px] text-[#5a4635]/40 mt-2 text-center">
        Tap on the map to place your delivery pin, or drag the marker to adjust
      </p>
    </div>
  );
}
