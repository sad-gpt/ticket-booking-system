import { ApiError } from '../utils/ApiError.js';

const validate = (schema) => (req, res, next) => {
  const validSchema = schema;
  const object = {
    params: req.params,
    query: req.query,
    body: req.body,
  };

  const { value, error } = validSchema.safeParse(object);

  if (error) {
    const errorMessage = error.issues
      .map((details) => details.message)
      .join(', ');
    return next(new ApiError(400, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

export { validate };
