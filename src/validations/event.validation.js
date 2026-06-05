import { z } from 'zod';

const createEvent = z.object({
  body: z.object({
    title: z.string().min(2),
    venueId: z.number().int().positive(),
    date: z.string().datetime(),
  }),
});

const getEvent = z.object({
  params: z.object({
    eventId: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export default {
  createEvent,
  getEvent,
};
