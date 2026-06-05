import { z } from 'zod';

const createBooking = z.object({
  body: z.object({
    userId: z.number().int().positive(),
    eventId: z.number().int().positive(),
    seatId: z.number().int().positive(),
  }),
});

const getBooking = z.object({
  params: z.object({
    bookingId: z.string().regex(/^\d+$/).transform(Number),
  }),
});

const getUserBookings = z.object({
  params: z.object({
    userId: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export default {
  createBooking,
  getBooking,
  getUserBookings,
};
