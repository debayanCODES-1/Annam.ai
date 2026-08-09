import { z } from 'zod';

export const farmSchema = z.object({
  farmerId: z.string().cuid(),
  farmName: z.string().min(2),
  areaInAcres: z.number().positive(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  soilType: z.string().min(2),
  irrigationType: z.string().min(2),
  currentCrop: z.string().min(2),
  cropStage: z.string().min(2),
});

export const machineryQuerySchema = z.object({
  type: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  district: z.string().optional(),
  availabilityStatus: z.string().optional(),
});

export const cropCompareSchema = z.object({
  district: z.string(),
  soilType: z.string(),
  irrigationType: z.string(),
  farmArea: z.number().positive(),
  currentCrop: z.string(),
  farmerPriority: z.enum(['Save water', 'Maximize income', 'Reduce risk', 'Short crop duration', 'Reduce residue']),
});

export const bookingCreateSchema = z.object({
  farmerId: z.string().cuid(),
  machineryId: z.string().cuid(),
  farmId: z.string().cuid(),
  requestedDate: z.string().datetime().optional(),
  acres: z.number().positive(),
  estimatedCost: z.number().nonnegative(),
  status: z.string(),
});

export const bookingUpdateSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED']),
});
