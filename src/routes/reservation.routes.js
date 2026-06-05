import express from 'express';
import { validate } from '../middlewares/validate.js';
import reservationController from '../controllers/reservation.controller.js';
import { z } from 'zod';

const router = express.Router();

const reserveSchema = z.object({
  body: z.object({
    userId: z.number().int().positive(),
    eventId: z.number().int().positive(),
    seatId: z.number().int().positive(),
  }),
});

const eventSeatParams = z.object({
  params: z.object({
    eventId: z.string().regex(/^\d+$/).transform(Number),
    seatId: z.string().regex(/^\d+$/).transform(Number),
  }),
});

router.post('/', validate(reserveSchema), reservationController.reserveSeat);
router.delete('/:eventId/:seatId', validate(eventSeatParams), reservationController.deleteReservation);
router.get('/:eventId', reservationController.getReservations);

export default router;
