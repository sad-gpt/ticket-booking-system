import express from 'express';
import { validate } from '../middlewares/validate.js';
import bookingValidation from '../validations/booking.validation.js';
import bookingController from '../controllers/booking.controller.js';

const router = express.Router();

router
  .route('/')
  .post(validate(bookingValidation.createBooking), bookingController.createBooking);

router
  .route('/:bookingId')
  .get(validate(bookingValidation.getBooking), bookingController.getBooking)
  .delete(validate(bookingValidation.getBooking), bookingController.cancelBooking);

export default router;
