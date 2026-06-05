import express from 'express';
import { validate } from '../middlewares/validate.js';
import eventValidation from '../validations/event.validation.js';
import availabilityController from '../controllers/availability.controller.js';

const router = express.Router({ mergeParams: true });

// We reuse the event validation for the eventId param
router.get('/', validate(eventValidation.getEvent), availabilityController.getAvailability);

export default router;
