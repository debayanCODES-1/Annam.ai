'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';

type BookingRequest = {
  id: string;
  status: string;
  requestedDate: string;
  acres: number;
  estimatedCost: number;
  farmName: string;
  farmerName: string;
  machineryName: string;
};

type BookingRequestCardProps = {
  bookings: BookingRequest[];
};

export default function BookingRequestCard({ bookings }: BookingRequestCardProps) {
  const [requests, setRequests] = useState(bookings);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(id: string, status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED') {
    setLoadingId(id);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.error || 'Unable to update booking.');
        return;
      }

      setRequests((current) => current.map((request) => (request.id === id ? { ...request, status } : request)));
    } catch {
      setError('Unable to connect to booking service.');
    } finally {
      setLoadingId(null);
    }
  }

  if (requests.length === 0) {
    return <p className="text-sm text-slate-600">No booking requests currently pending.</p>;
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">{request.farmName} · {request.farmerName}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{request.machineryName}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {request.acres} acres · ₹{request.estimatedCost} · {new Date(request.requestedDate).toLocaleDateString('en-IN')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{request.status}</p>
              <p className="text-xs text-slate-500">Requested</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" disabled={loadingId === request.id} onClick={() => updateStatus(request.id, 'ACCEPTED')}>
              Accept
            </Button>
            <Button type="button" className="bg-slate-100 text-slate-900 hover:bg-slate-200" disabled={loadingId === request.id} onClick={() => updateStatus(request.id, 'REJECTED')}>
              Reject
            </Button>
            {request.status === 'ACCEPTED' && (
              <Button type="button" className="bg-emerald-500 text-white hover:bg-emerald-600" disabled={loadingId === request.id} onClick={() => updateStatus(request.id, 'COMPLETED')}>
                Mark completed
              </Button>
            )}
          </div>
        </div>
      ))}
      {error && <p className="text-sm text-rose-700">{error}</p>}
    </div>
  );
}
