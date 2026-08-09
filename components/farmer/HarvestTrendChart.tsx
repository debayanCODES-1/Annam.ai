'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

type HarvestHistoryItem = {
  harvestDate: string | Date;
  estimatedYieldTonnes: number;
  estimatedResidueTonnes: number;
};

type HarvestTrendChartProps = {
  history: HarvestHistoryItem[];
};

export default function HarvestTrendChart({ history }: HarvestTrendChartProps) {
  if (history.length === 0) {
    return <p className="text-sm text-slate-600">No harvest history is available yet.</p>;
  }

  const data = history.map((record) => ({
    date: new Date(record.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    yield: record.estimatedYieldTonnes,
    residue: record.estimatedResidueTonnes,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 12 }} stroke="#CBD5E1" />
        <YAxis tick={{ fill: '#475569', fontSize: 12 }} stroke="#CBD5E1" />
        <Tooltip contentStyle={{ borderRadius: 16, borderColor: '#E2E8F0' }} />
        <Line type="monotone" dataKey="yield" stroke="#0F766E" strokeWidth={3} dot={{ r: 4 }} name="Yield (t)" />
        <Line type="monotone" dataKey="residue" stroke="#9333EA" strokeWidth={3} dot={{ r: 4 }} name="Residue (t)" />
      </LineChart>
    </ResponsiveContainer>
  );
}
