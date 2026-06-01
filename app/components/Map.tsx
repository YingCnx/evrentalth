"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { Station } from "./StationCard";

type Props = {
  stations: Station[];
  onSelect: (s: Station) => void;
  selected: Station | null;
};

export default function Map({ stations, onSelect, selected }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const initRef = useRef(false);

  // Init map once — guard against React StrictMode double-invoke
  useEffect(() => {
    if (typeof window === "undefined" || initRef.current || !mapRef.current) return;
    initRef.current = true;

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

    return () => {
      instance?.remove();
      initRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render markers when map or stations change
  useEffect(() => {
    if (!map) return;

    import("leaflet").then((L) => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      stations.forEach((station) => {
        const { Latitude, Longitude, Title } = station.AddressInfo;
        const isSelected = selected?.ID === station.ID;

        const icon = L.divIcon({
          className: "",
          html: isSelected
            ? `<div style="background:#f97316;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.5)"></div>`
            : `<div style="background:#22c55e;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
          iconSize: isSelected ? [20, 20] : [14, 14],
          iconAnchor: isSelected ? [10, 10] : [7, 7],
        });

        const marker = L.marker([Latitude, Longitude], { icon, title: Title })
          .addTo(map)
          .on("click", () => onSelect(station));

        markersRef.current.push(marker);
      });
    });
  }, [map, stations, selected, onSelect]);

  // Pan to selected station
  useEffect(() => {
    if (!map || !selected) return;
    const { Latitude, Longitude } = selected.AddressInfo;
    map.panTo([Latitude, Longitude], { animate: true });
  }, [map, selected]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full"
      role="application"
      aria-label="แผนที่จุดชาร์จรถไฟฟ้า EV Charging Station Map"
    />
  );
}
