"use client";

import { useEffect, useRef, useState } from "react";
import type { Station } from "./StationCard";
import type { RouteResult, RouteStation } from "./RoutePlanner";

type Props = {
  stations: Station[];
  onSelect: (s: Station) => void;
  selected: Station | null;
  focusCoords?: [number, number];
  resetView?: boolean;
  // Route planner
  routeResult?: RouteResult | null;
  routeOrigin?: [number, number] | null;
  routeDest?: [number, number] | null;
  selectedRouteStation?: RouteStation | null;
};

export default function Map({
  stations, onSelect, selected, focusCoords, resetView,
  routeResult, routeOrigin, routeDest, selectedRouteStation,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routeLayersRef = useRef<any[]>([]);
  const initRef = useRef(false);

  // Init map once
  useEffect(() => {
    if (typeof window === "undefined" || initRef.current || !mapRef.current) return;
    initRef.current = true;
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let instance: any;

    import("leaflet").then((L) => {
      if (!mapRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      instance = L.map(mapRef.current!, { zoomControl: false }).setView([13.736717, 100.523186], 7);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(instance);
      L.control.zoom({ position: "bottomright" }).addTo(instance);
      setMap(instance);
    });

    return () => { instance?.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Browse mode markers
  useEffect(() => {
    if (!map || routeResult) return;
    import("leaflet").then((L) => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      stations.forEach((station) => {
        const { Latitude, Longitude, Title } = station.AddressInfo;
        const isSelected = selected?.ID === station.ID;
        const icon = L.divIcon({
          className: "",
          html: isSelected
            ? `<div style="position:relative;width:22px;height:22px">
                <div style="position:absolute;inset:0;border-radius:50%;background:rgba(249,115,22,0.35);animation:ev-pulse-ring 1.4s ease-out infinite"></div>
                <div style="position:absolute;inset:3px;background:#f97316;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 8px rgba(249,115,22,.6)"></div>
               </div>`
            : `<div style="position:relative;width:18px;height:18px">
                <div style="position:absolute;inset:0;border-radius:50%;background:rgba(0,200,255,0.3);animation:ev-pulse-ring 2s ease-out infinite"></div>
                <div style="position:absolute;inset:3px;background:#00C8FF;border-radius:50%;border:2px solid white;box-shadow:0 1px 6px rgba(0,200,255,.5)"></div>
               </div>`,
          iconSize: isSelected ? [22, 22] : [18, 18],
          iconAnchor: isSelected ? [11, 11] : [9, 9],
        });
        const marker = L.marker([Latitude, Longitude], { icon, title: Title })
          .addTo(map).on("click", () => onSelect(station));
        markersRef.current.push(marker);
      });
    });
  }, [map, stations, selected, onSelect, routeResult]);

  // Pan to selected station (browse mode)
  useEffect(() => {
    if (!map || !selected || routeResult) return;
    map.panTo([selected.AddressInfo.Latitude, selected.AddressInfo.Longitude], { animate: true });
  }, [map, selected, routeResult]);

  // Fit bounds / fly to province (browse mode)
  useEffect(() => {
    if (!map || routeResult) return;
    if (focusCoords) { map.flyTo(focusCoords, 11, { animate: true, duration: 1 }); return; }
    if (stations.length > 0) {
      import("leaflet").then((L) => {
        const coords = stations.map((s) => [s.AddressInfo.Latitude, s.AddressInfo.Longitude] as [number, number]).filter(([lat, lng]) => lat && lng);
        if (coords.length === 0) return;
        map.fitBounds(L.latLngBounds(coords), { padding: [40, 40], maxZoom: 12, animate: true });
      });
    }
  }, [map, stations, focusCoords, resetView, routeResult]);

  // Route mode — draw polyline + markers
  useEffect(() => {
    if (!map) return;

    import("leaflet").then((L) => {
      // Clear previous route layers + browse markers
      routeLayersRef.current.forEach((l) => l.remove());
      routeLayersRef.current = [];
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      if (!routeResult || !routeOrigin || !routeDest) return;

      // Route polyline — [lon, lat] → [lat, lon]
      const latlngs = routeResult.route.map(([lon, lat]) => [lat, lon] as [number, number]);
      const polyline = L.polyline(latlngs, { color: "#3b82f6", weight: 4, opacity: 0.8 }).addTo(map);
      routeLayersRef.current.push(polyline);

      // Origin marker
      const originIcon = L.divIcon({
        className: "",
        html: `<div style="background:#22c55e;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center">
          <div style="width:6px;height:6px;background:white;border-radius:50%"></div></div>`,
        iconSize: [18, 18], iconAnchor: [9, 9],
      });
      routeLayersRef.current.push(L.marker(routeOrigin, { icon: originIcon }).addTo(map));

      // Dest marker
      const destIcon = L.divIcon({
        className: "",
        html: `<div style="background:#ef4444;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center">
          <div style="width:6px;height:6px;background:white;border-radius:50%"></div></div>`,
        iconSize: [18, 18], iconAnchor: [9, 9],
      });
      routeLayersRef.current.push(L.marker(routeDest, { icon: destIcon }).addTo(map));

      // Charging stations along route
      routeResult.stations.forEach((s) => {
        const isSelected = selectedRouteStation?.id === s.id;
        const color = isSelected ? "#f97316" : s.reachable ? "#22c55e" : "#ef4444";
        const size = isSelected ? 20 : 14;
        const icon = L.divIcon({
          className: "",
          html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
          iconSize: [size, size], iconAnchor: [size / 2, size / 2],
        });
        routeLayersRef.current.push(L.marker([s.lat, s.lon], { icon, title: s.name }).addTo(map));
      });

      // Fit route bounds
      map.fitBounds(polyline.getBounds(), { padding: [60, 60], animate: true });
    });
  }, [map, routeResult, routeOrigin, routeDest, selectedRouteStation]);

  return (
    <div ref={mapRef} className="w-full h-full" role="application"
      aria-label="แผนที่จุดชาร์จรถไฟฟ้า EV Charging Station Map" />
  );
}
