import { z } from 'zod';

const createUser = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(2),
  }),
});

const getUser = z.object({
  params: z.object({
    userId: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export default {
  createUser,
  getUser,
};
