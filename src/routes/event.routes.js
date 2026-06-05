import express from 'express';
import { validate } from '../middlewares/validate.js';
import eventValidation from '../validations/event.validation.js';
import eventController from '../controllers/event.controller.js';

const router = express.Router();

router
  .route('/')
  .post(validate(eventValidation.createEvent), eventController.createEvent)
  .get(eventController.getEvents);

router
  .route('/:eventId')
  .get(validate(eventValidation.getEvent), eventController.getEvent);

export default router;
