import { z } from 'zod';

const createVenue = z.object({
  body: z.object({
    name: z.string().min(2),
    address: z.string().min(5),
  }),
});

const getVenue = z.object({
  params: z.object({
    venueId: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export default {
  createVenue,
  getVenue,
};
