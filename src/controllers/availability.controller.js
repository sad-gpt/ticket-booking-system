import availabilityService from '../services/availability.service.js';

const getAvailability = async (req, res, next) => {
  try {
    const availability = await availabilityService.getEventAvailability(
      parseInt(req.params.eventId)
    );
    res.send(availability);
  } catch (error) {
    next(error);
  }
};

export default {
  getAvailability,
};
