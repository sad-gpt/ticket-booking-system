import seatRepository from '../repositories/seat.repository.js';
import venueRepository from '../repositories/venue.repository.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Add a seat to a venue
 * @param {number} venueId 
 * @param {Object} seatBody 
 */
const addSeatToVenue = async (venueId, seatBody) => {
  const venue = await venueRepository.getVenueById(venueId);
  if (!venue) {
    throw new ApiError(404, 'Venue not found');
  }

  const existingSeat = await seatRepository.getSeatByLocation(
    venueId,
    seatBody.row,
    seatBody.number
  );

  if (existingSeat) {
    throw new ApiError(400, 'Seat at this location already exists in this venue');
  }

  return seatRepository.createSeat({
    ...seatBody,
    venueId,
  });
};

/**
 * Get all seats for a venue
 * @param {number} venueId 
 */
const getVenueSeats = async (venueId) => {
  const venue = await venueRepository.getVenueById(venueId);
  if (!venue) {
    throw new ApiError(404, 'Venue not found');
  }

  return seatRepository.getSeatsByVenueId(venueId);
};

export default {
  addSeatToVenue,
  getVenueSeats,
};
