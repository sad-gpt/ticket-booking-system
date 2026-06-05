import express from 'express';
import { validate } from '../middlewares/validate.js';
import venueValidation from '../validations/venue.validation.js';
import venueController from '../controllers/venue.controller.js';

const router = express.Router();

router
  .route('/')
  .post(validate(venueValidation.createVenue), venueController.createVenue)
  .get(venueController.getVenues);

router
  .route('/:venueId')
  .get(validate(venueValidation.getVenue), venueController.getVenue);

export default router;
