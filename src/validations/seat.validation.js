import { z } from 'zod';

const createSeat = z.object({
  params: z.object({
    venueId: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    row: z.string().min(1),
    number: z.number().int().positive(),
    type: z.enum(['REGULAR', 'VIP', 'ACCESSIBLE']),
  }),
});

const getSeats = z.object({
  params: z.object({
    venueId: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export default {
  createSeat,
  getSeats,
};
