'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { z } from 'zod';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';
import { Stack } from '../../../components/ui/stack';
import { t } from '../../../lib/i18n';

const onboardingSchema = z.object({
  name: z.string().min(2, 'Enter your name.'),
  preferredLanguage: z.enum(['en', 'hi', 'pa']),
  village: z.string().min(2, 'Enter your village.'),
  district: z.string().min(2, 'Enter your district.'),
  state: z.string().min(2, 'Enter your state.'),
  areaInAcres: z.number().positive('Area must be positive.'),
  currentCrop: z.string().min(2, 'Select your current crop.'),
  soilType: z.string().min(2, 'Select your soil type.'),
  irrigationType: z.string().min(2, 'Select an irrigation type.'),
  harvestDate: z.string().min(10, 'Select a harvest date.'),
  estimatedYield: z.number().positive('Enter estimated yield.'),
  hasMachinery: z.boolean(),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export default function FarmerOnboardingPage() {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState<'en' | 'hi' | 'pa'>('en');
  const [offlineSaved, setOfflineSaved] = useState(false);

  const translation = useMemo(() => t(language), [language]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OnboardingValues>({
    defaultValues: {
      name: '',
      preferredLanguage: 'en',
      village: '',
      district: '',
      state: 'Punjab',
      areaInAcres: 5,
      currentCrop: 'Paddy',
      soilType: 'Loamy',
      irrigationType: 'Canal',
      harvestDate: '',
      estimatedYield: 5,
      hasMachinery: false,
    },
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = (values: OnboardingValues) => {
    window.localStorage.setItem('parali-onboarding', JSON.stringify(values));
    setOfflineSaved(true);
    setStep(4);
  };

  const currentValues = watch();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <Card className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Farmer onboarding</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">{translation.onboarding.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Language</label>
              <Select value={language} onChange={(event) => setLanguage(event.target.value as 'en' | 'hi' | 'pa')}>
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="pa">ਪੰਜਾਬੀ</option>
              </Select>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-600">
              {step === 1 && translation.onboarding.step1}
              {step === 2 && translation.onboarding.step2}
              {step === 3 && translation.onboarding.step3}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-slate-700">
              <span className={step === 1 ? 'font-semibold text-primary' : 'text-slate-500'}>1</span>
              <span className={step === 2 ? 'font-semibold text-primary' : 'text-slate-500'}>2</span>
              <span className={step === 3 ? 'font-semibold text-primary' : 'text-slate-500'}>3</span>
            </div>
          </div>

          {step === 4 ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-slate-900">
              <h2 className="text-xl font-semibold">Onboarding saved offline</h2>
              <p className="mt-3 text-sm text-slate-700">Your farmer profile is ready. Open the dashboard to continue the demo flow.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/farmer/dashboard" className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90">
                  Go to farmer dashboard
                </Link>
                <Button type="button" className="bg-slate-100 text-slate-900 hover:bg-slate-200" onClick={() => setStep(1)}>
                  Edit details
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <Stack>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">{translation.onboarding.name}</label>
                    <Input {...register('name')} placeholder="Amarjeet Kaur" />
                    {errors.name && <p className="mt-2 text-sm text-danger">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">{translation.onboarding.language}</label>
                    <Select {...register('preferredLanguage')}>
                      <option value="en">English</option>
                      <option value="hi">हिंदी</option>
                      <option value="pa">ਪੰਜਾਬੀ</option>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">{translation.onboarding.village}</label>
                    <Input {...register('village')} placeholder="Badi Khera" />
                    {errors.village && <p className="mt-2 text-sm text-danger">{errors.village.message}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">{translation.onboarding.district}</label>
                    <Input {...register('district')} placeholder="Patiala" />
                    {errors.district && <p className="mt-2 text-sm text-danger">{errors.district.message}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">{translation.onboarding.state}</label>
                    <Input {...register('state')} placeholder="Punjab" />
                    {errors.state && <p className="mt-2 text-sm text-danger">{errors.state.message}</p>}
                  </div>
                </Stack>
              )}

              {step === 2 && (
                <Stack>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">{translation.onboarding.area}</label>
                    <Input type="number" step="0.1" {...register('areaInAcres', { valueAsNumber: true })} placeholder="5" />
                    {errors.areaInAcres && <p className="mt-2 text-sm text-danger">{errors.areaInAcres.message}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">{translation.onboarding.currentCrop}</label>
                    <Select {...register('currentCrop')}>
                      <option value="Paddy">Paddy</option>
                      <option value="Maize">Maize</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Pulses">Pulses</option>
                      <option value="Mustard">Mustard</option>
                      <option value="Vegetables">Vegetables</option>
                    </Select>
                    {errors.currentCrop && <p className="mt-2 text-sm text-danger">{errors.currentCrop.message}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">{translation.onboarding.soilType}</label>
                    <Select {...register('soilType')}>
                      <option value="Loamy">Loamy</option>
                      <option value="Sandy loam">Sandy loam</option>
                      <option value="Clay loam">Clay loam</option>
                      <option value="Silty loam">Silty loam</option>
                    </Select>
                    {errors.soilType && <p className="mt-2 text-sm text-danger">{errors.soilType.message}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">{translation.onboarding.irrigationType}</label>
                    <Select {...register('irrigationType')}>
                      <option value="Canal">Canal</option>
                      <option value="Tube well">Tube well</option>
                      <option value="Rainfed">Rainfed</option>
                    </Select>
                    {errors.irrigationType && <p className="mt-2 text-sm text-danger">{errors.irrigationType.message}</p>}
                  </div>
                </Stack>
              )}

              {step === 3 && (
                <Stack>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">{translation.onboarding.harvestDate}</label>
                    <Input type="date" {...register('harvestDate')} />
                    {errors.harvestDate && <p className="mt-2 text-sm text-danger">{errors.harvestDate.message}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">{translation.onboarding.estimatedYield}</label>
                    <Input type="number" step="0.1" {...register('estimatedYield', { valueAsNumber: true })} placeholder="6.2" />
                    {errors.estimatedYield && <p className="mt-2 text-sm text-danger">{errors.estimatedYield.message}</p>}
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-900">
                      <input type="checkbox" {...register('hasMachinery')} className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" />
                      {translation.onboarding.hasMachinery}
                    </label>
                  </div>
                </Stack>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <Button type="button" className="bg-slate-100 text-slate-900 hover:bg-slate-200" onClick={() => setStep((value) => Math.max(1, value - 1))}>
                  {translation.onboarding.back}
                </Button>
                {step < 3 ? (
                  <Button type="button" onClick={() => setStep((value) => Math.min(3, value + 1))}>{translation.onboarding.next}</Button>
                ) : (
                  <Button type="submit">{translation.onboarding.complete}</Button>
                )}
              </div>

              {offlineSaved && (
                <Card className="rounded-3xl bg-emerald-50 border-emerald-200 text-slate-900">
                  <p className="text-sm">Profile saved for offline use. You can continue when you are back online.</p>
                </Card>
              )}
            </form>
          )}
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="bg-primary/5 border-primary/20">
            <h2 className="text-lg font-semibold text-slate-900">Save offline</h2>
            <p className="mt-2 text-sm text-slate-700">This demo stores onboarding details locally so the farmer can continue without a network.</p>
          </Card>
          <Card className="bg-slate-50 border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
            <p className="mt-2 text-sm text-slate-700">Name: {currentValues.name || '—'}</p>
            <p className="mt-1 text-sm text-slate-700">Crop: {currentValues.currentCrop}</p>
            <p className="mt-1 text-sm text-slate-700">Village: {currentValues.village || '—'}</p>
          </Card>
        </div>
      </div>
    </main>
  );
}
