import venueService from '../services/venue.service.js';

const createVenue = async (req, res, next) => {
  try {
    const venue = await venueService.createVenue(req.body);
    res.status(201).send(venue);
  } catch (error) {
    next(error);
  }
};

const getVenues = async (req, res, next) => {
  try {
    const venues = await venueService.queryVenues();
    res.send(venues);
  } catch (error) {
    next(error);
  }
};

const getVenue = async (req, res, next) => {
  try {
    const venue = await venueService.getVenueById(parseInt(req.params.venueId));
    res.send(venue);
  } catch (error) {
    next(error);
  }
};

export default {
  createVenue,
  getVenues,
  getVenue,
};
