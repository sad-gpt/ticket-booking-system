import bookingService from '../services/booking.service.js';

const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).send(booking);
  } catch (error) {
    next(error);
  }
};

const getBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(parseInt(req.params.bookingId));
    res.send(booking);
  } catch (error) {
    next(error);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getBookingsByUser(parseInt(req.params.userId));
    res.send(bookings);
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(parseInt(req.params.bookingId));
    res.send(booking);
  } catch (error) {
    next(error);
  }
};

export default {
  createBooking,
  getBooking,
  getUserBookings,
  cancelBooking,
};
