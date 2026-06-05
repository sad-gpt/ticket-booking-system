import eventService from '../services/event.service.js';

const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body);
    res.status(201).send(event);
  } catch (error) {
    next(error);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const events = await eventService.queryEvents();
    res.send(events);
  } catch (error) {
    next(error);
  }
};

const getEvent = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(parseInt(req.params.eventId));
    res.send(event);
  } catch (error) {
    next(error);
  }
};

export default {
  createEvent,
  getEvents,
  getEvent,
};
