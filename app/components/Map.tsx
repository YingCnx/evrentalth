"use client";

import { useEffect, useRef } from "react";
import type { Station } from "./StationCard";

type Props = {
  stations: Station[];
  onSelect: (s: Station) => void;
  selected: Station | null;
};

export default function Map({ stations, onSelect, selected }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || mapInstance.current) return;

    import("leaflet").then((L) => {
      if (!mapRef.current) return;

      // Fix default marker icon path issue with webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, { zoomControl: false }).setView([13.736717, 100.523186], 7);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstance.current = map;
    });

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // Render markers when stations change
  useEffect(() => {
    if (!mapInstance.current) return;

    import("leaflet").then((L) => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const greenIcon = L.divIcon({
        className: "",
        html: `<div style="background:#22c55e;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const selectedIcon = L.divIcon({
        className: "",
        html: `<div style="background:#f97316;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.5)"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      stations.forEach((station) => {
        const { Latitude, Longitude, Title } = station.AddressInfo;
        const isSelected = selected?.ID === station.ID;

        const marker = L.marker([Latitude, Longitude], {
          icon: isSelected ? selectedIcon : greenIcon,
          title: Title,
        })
          .addTo(mapInstance.current)
          .on("click", () => onSelect(station));

        markersRef.current.push(marker);
      });
    });
  }, [stations, selected, onSelect]);

  // Pan to selected
  useEffect(() => {
    if (!mapInstance.current || !selected) return;
    const { Latitude, Longitude } = selected.AddressInfo;
    mapInstance.current.panTo([Latitude, Longitude], { animate: true });
  }, [selected]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full"
      role="application"
      aria-label="แผนที่จุดชาร์จรถไฟฟ้า EV Charging Station Map"
    />
  );
}
