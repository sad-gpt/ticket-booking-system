import express from 'express';
import { validate } from '../middlewares/validate.js';
import seatValidation from '../validations/seat.validation.js';
import seatController from '../controllers/seat.controller.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(validate(seatValidation.createSeat), seatController.createSeat)
  .get(validate(seatValidation.getSeats), seatController.getSeats);

export default router;
