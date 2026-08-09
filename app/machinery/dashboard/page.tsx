export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '../../../lib/db/prisma';
import BookingRequestCard from '../../../components/provider/BookingRequestCard';

async function getBookingRequests() {
  const bookings = await prisma.machineryBooking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      farmer: true,
      farm: true,
      machinery: true,
    },
  });

  return bookings.map((booking) => ({
    id: booking.id,
    status: booking.status,
    requestedDate: booking.requestedDate.toISOString(),
    acres: booking.acres,
    estimatedCost: booking.estimatedCost,
    farmName: booking.farm.farmName,
    farmerName: booking.farmer.name,
    machineryName: booking.machinery.name,
  }));
}

export default async function MachineryDashboardPage() {
  const bookingRequests = await getBookingRequests();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">Machinery provider</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Provider dashboard</h1>
              <p className="mt-3 text-slate-600">Manage incoming requests and update booking status for your fleet.</p>
            </div>
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Total bookings</p>
              <p className="mt-2 text-3xl font-semibold">{bookingRequests.length}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Booking requests</h2>
              <p className="mt-2 text-sm text-slate-600">Review and act on requests from farmers in your service area.</p>
              <div className="mt-6">
                <BookingRequestCard bookings={bookingRequests} />
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Provider actions</h2>
              <p className="mt-3 text-sm text-slate-600">Accept, reject, or complete requests directly from this dashboard.</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Tip</p>
                  <p className="mt-2 text-sm text-slate-700">Keep availability status updated so farmers can find your machinery quickly.</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Note</p>
                  <p className="mt-2 text-sm text-slate-700">Booking updates are sent via the API and reflected in the request state immediately.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/machinery" className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-4 py-3 text-base font-semibold text-slate-900 hover:bg-amber-400">
              Back to provider home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
