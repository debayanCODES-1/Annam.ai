'use client';

import { useMemo, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Stack } from '../../components/ui/stack';

type Machinery = {
  id: string;
  name: string;
  type: string;
  pricePerAcre: number;
  village: string;
  district: string;
};

type BookMachineryCardProps = {
  farmId: string;
  farmerId: string;
  machinery: Machinery[];
};

export default function BookMachineryCard({ farmId, farmerId, machinery }: BookMachineryCardProps) {
  const [selectedMachineId, setSelectedMachineId] = useState(machinery[0]?.id ?? '');
  const [acres, setAcres] = useState(2);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedMachine = useMemo(() => machinery.find((machine) => machine.id === selectedMachineId), [machinery, selectedMachineId]);
  const estimatedCost = selectedMachine ? acres * selectedMachine.pricePerAcre : 0;

  async function handleBook(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!selectedMachine) {
      setError('Select a machine first.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId,
          machineryId: selectedMachine.id,
          farmId,
          requestedDate: new Date().toISOString(),
          acres,
          estimatedCost,
          status: 'PENDING',
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.error || 'Failed to request booking.');
      } else {
        setMessage('Booking request submitted. Provider will review it soon.');
      }
    } catch {
      setError('Unable to connect to booking service.');
    } finally {
      setLoading(false);
    }
  }

  if (machinery.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-sm text-slate-700">No available machinery found to request a booking.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Request machinery</p>
      <h2 className="mt-3 text-2xl font-semibold text-slate-900">Book a provider</h2>
      <form onSubmit={handleBook} className="mt-6 space-y-4">
        <Stack>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Machine</label>
            <Select value={selectedMachineId} onChange={(event) => setSelectedMachineId(event.target.value)}>
              {machinery.map((machine) => (
                <option key={machine.id} value={machine.id}>
                  {machine.name} • ₹{machine.pricePerAcre}/acre
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Acres to book</label>
            <Input type="number" min={1} step={0.5} value={acres} onChange={(event) => setAcres(Number(event.target.value))} />
          </div>
        </Stack>

        <div className="rounded-2xl bg-white p-4">
          <p className="text-sm text-slate-500">Estimated cost</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">₹{estimatedCost.toFixed(0)}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
            {loading ? 'Requesting...' : 'Send booking request'}
          </Button>
          {message && <p className="text-sm text-emerald-700">{message}</p>}
          {error && <p className="text-sm text-rose-700">{error}</p>}
        </div>
      </form>
    </div>
  );
}
