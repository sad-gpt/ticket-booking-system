import eventRepository from '../repositories/event.repository.js';
import venueRepository from '../repositories/venue.repository.js';
import { ApiError } from '../utils/ApiError.js';

const createEvent = async (eventBody) => {
  const venue = await venueRepository.getVenueById(eventBody.venueId);
  if (!venue) {
    throw new ApiError(404, 'Venue not found');
  }

  // Ensure date is in the future
  const eventDate = new Date(eventBody.date);
  if (eventDate < new Date()) {
    throw new ApiError(400, 'Event date must be in the future');
  }

  return eventRepository.createEvent(eventBody);
};

const queryEvents = async () => {
  const events = await eventRepository.getEvents();
  return events.map(event => ({
    id: event.id,
    title: event.title,
    venueName: event.venue.name,
    date: event.date,
  }));
};

const getEventById = async (id) => {
  const event = await eventRepository.getEventById(id);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  return {
    id: event.id,
    title: event.title,
    date: event.date,
    venue: {
      id: event.venue.id,
      name: event.venue.name,
      address: event.venue.address,
    },
    totalSeats: event.venue._count.seats,
  };
};

export default {
  createEvent,
  queryEvents,
  getEventById,
};
