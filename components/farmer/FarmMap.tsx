'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

type Location = {
  latitude: number;
  longitude: number;
};

type MachineryMarker = {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  pricePerAcre: number;
  availabilityStatus: string;
  village: string;
  district: string;
};

type BuyerMarker = {
  id: string;
  name: string;
  buyerType: string;
  village: string;
  district: string;
  latitude: number;
  longitude: number;
  pricePerTonne: number;
};

type FarmMapProps = {
  farmLocation: Location;
  machinery: MachineryMarker[];
  buyers: BuyerMarker[];
};

export default function FarmMap({ farmLocation, machinery, buyers }: FarmMapProps) {
  const position: [number, number] = [farmLocation.latitude, farmLocation.longitude];

  return (
    <div className="h-full rounded-3xl border border-slate-200 bg-white shadow-sm">
      <MapContainer center={position} zoom={11} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker center={position} radius={12} pathOptions={{ color: '#0f766e', fillColor: '#0f766e', fillOpacity: 0.35 }}>
          <Popup>Farm location</Popup>
        </CircleMarker>
        {machinery.map((machine) => (
          <CircleMarker
            key={machine.id}
            center={[machine.latitude, machine.longitude]}
            radius={8}
            pathOptions={{ color: '#c2410c', fillColor: '#f97316', fillOpacity: 0.5 }}
          >
            <Popup>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">{machine.name}</p>
                <p>{machine.type}</p>
                <p>₹{machine.pricePerAcre}/acre</p>
                <p>{machine.village}, {machine.district}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        {buyers.map((buyer) => (
          <CircleMarker
            key={buyer.id}
            center={[buyer.latitude, buyer.longitude]}
            radius={8}
            pathOptions={{ color: '#047857', fillColor: '#22c55e', fillOpacity: 0.45 }}
          >
            <Popup>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">{buyer.name}</p>
                <p>{buyer.buyerType}</p>
                <p>₹{buyer.pricePerTonne}/tonne</p>
                <p>{buyer.village}, {buyer.district}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
