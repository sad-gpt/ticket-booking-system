import reservationService from '../services/reservation.service.js';

const reserveSeat = async (req, res, next) => {
  try {
    const reservation = await reservationService.reserveSeat(req.body);
    res.status(201).send(reservation);
  } catch (error) {
    next(error);
  }
};

const deleteReservation = async (req, res, next) => {
  try {
    await reservationService.releaseReservation(
      parseInt(req.params.eventId),
      parseInt(req.params.seatId),
      parseInt(req.body.userId) // In production, this would come from Auth middleware
    );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getReservations = async (req, res, next) => {
  try {
    const reservations = await reservationService.getEventReservations(
      parseInt(req.params.eventId)
    );
    res.send(reservations);
  } catch (error) {
    next(error);
  }
};

export default {
  reserveSeat,
  deleteReservation,
  getReservations,
};
