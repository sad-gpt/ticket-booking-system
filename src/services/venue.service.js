import venueRepository from '../repositories/venue.repository.js';
import { ApiError } from '../utils/ApiError.js';

const createVenue = async (venueBody) => {
  // Check if venue with same name already exists (optional but good practice)
  const existingVenue = await venueRepository.getVenueByName(venueBody.name);
  if (existingVenue) {
    throw new ApiError(400, 'Venue with this name already exists');
  }
  return venueRepository.createVenue(venueBody);
};

const queryVenues = async () => {
  return venueRepository.getVenues();
};

const getVenueById = async (id) => {
  const venue = await venueRepository.getVenueById(id);
  if (!venue) {
    throw new ApiError(404, 'Venue not found');
  }
  return venue;
};

export default {
  createVenue,
  queryVenues,
  getVenueById,
};
