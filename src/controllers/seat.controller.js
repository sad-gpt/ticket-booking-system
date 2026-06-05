import seatService from '../services/seat.service.js';

const createSeat = async (req, res, next) => {
  try {
    const seat = await seatService.addSeatToVenue(
      parseInt(req.params.venueId),
      req.body
    );
    res.status(201).send(seat);
  } catch (error) {
    next(error);
  }
};

const getSeats = async (req, res, next) => {
  try {
    const seats = await seatService.getVenueSeats(parseInt(req.params.venueId));
    res.send(seats);
  } catch (error) {
    next(error);
  }
};

export default {
  createSeat,
  getSeats,
};
