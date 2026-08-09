'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '../ui/card';

type FarmerProfile = {
  name: string;
  preferredLanguage: 'en' | 'hi' | 'pa';
  village: string;
  district: string;
  state: string;
  areaInAcres: number;
  currentCrop: string;
  soilType: string;
  irrigationType: string;
  harvestDate: string;
  estimatedYield: number;
  hasMachinery: boolean;
};

export default function StoredFarmerProfile() {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('parali-onboarding');
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch {
        setProfile(null);
      }
    }
  }, []);

  function clearProfile() {
    window.localStorage.removeItem('parali-onboarding');
    setProfile(null);
  }

  if (!profile) {
    return (
      <Card className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-sm text-slate-700">No saved onboarding profile found. Complete onboarding to persist your farmer profile across pages.</p>
        <Link href="/farmer/onboarding" className="mt-4 inline-flex rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90">
          Complete onboarding
        </Link>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Saved farmer profile</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">{profile.name}</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Village</p>
            <p className="text-sm font-medium text-slate-900">{profile.village}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">District</p>
            <p className="text-sm font-medium text-slate-900">{profile.district}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Crop</p>
            <p className="text-sm font-medium text-slate-900">{profile.currentCrop}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Area</p>
            <p className="text-sm font-medium text-slate-900">{profile.areaInAcres} acres</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Harvest date</p>
            <p className="text-sm font-medium text-slate-900">{profile.harvestDate}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Estimated yield</p>
            <p className="text-sm font-medium text-slate-900">{profile.estimatedYield} t</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Machinery</p>
            <p className="text-sm font-medium text-slate-900">{profile.hasMachinery ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Soil / irrigation</p>
            <p className="text-sm font-medium text-slate-900">{profile.soilType}, {profile.irrigationType}</p>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
          Keep this profile updated to improve residue pricing, crop comparison, and machinery booking recommendations.
        </div>

        <button type="button" className="mt-2 inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50" onClick={clearProfile}>
          Clear saved profile
        </button>
      </div>
    </Card>
  );
}
