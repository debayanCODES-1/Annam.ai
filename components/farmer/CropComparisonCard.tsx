'use client';

import { FormEvent, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Stack } from '../../components/ui/stack';

const priorities = [
  'Save water',
  'Maximize income',
  'Reduce risk',
  'Short crop duration',
  'Reduce residue',
] as const;

type CropComparisonCardProps = {
  district: string;
  soilType: string;
  irrigationType: string;
  farmArea: number;
  currentCrop: string;
};

type CropRecommendationResult = {
  crop: string;
  reason: string;
  uncertainty: string;
  waterScore: number;
  incomeScore: number;
  riskScore: number;
  residueScore: number;
};

export default function CropComparisonCard({ district, soilType, irrigationType, farmArea, currentCrop }: CropComparisonCardProps) {
  const [priority, setPriority] = useState<typeof priorities[number]>('Save water');
  const [result, setResult] = useState<CropRecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCompare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district,
          soilType,
          irrigationType,
          farmArea,
          currentCrop,
          farmerPriority: priority,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.error || 'Failed to compare crops');
      } else {
        setResult(payload.data);
      }
    } catch (fetchError) {
      setError('Unable to connect to crop comparison service.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Compare crops</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">Find a water-smart option</h2>
        </div>
      </div>

      <form onSubmit={handleCompare} className="mt-6 space-y-4">
        <Stack>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Current crop</label>
            <Input value={currentCrop} readOnly />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Priority</label>
            <Select value={priority} onChange={(event) => setPriority(event.target.value as typeof priorities[number])}>
              {priorities.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
        </Stack>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-semibold text-slate-800">District</label>
            <Input value={district} readOnly />
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm font-semibold text-slate-800">Soil type</label>
            <Input value={soilType} readOnly />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-semibold text-slate-800">Irrigation</label>
            <Input value={irrigationType} readOnly />
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm font-semibold text-slate-800">Farm area (acres)</label>
            <Input value={farmArea.toString()} readOnly />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
            {loading ? 'Comparing...' : 'Compare crops'}
          </Button>
          {error && <p className="text-sm text-rose-700">{error}</p>}
        </div>
      </form>

      {result && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Recommended crop</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{result.crop}</h3>
          <p className="mt-3 text-sm text-slate-600">{result.reason}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Water score</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{Math.round(result.waterScore * 100)}%</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Income score</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{Math.round(result.incomeScore * 100)}%</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Risk score</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{Math.round(result.riskScore * 100)}%</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Residue score</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{Math.round(result.residueScore * 100)}%</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">{result.uncertainty}</p>
        </div>
      )}
    </div>
  );
}
