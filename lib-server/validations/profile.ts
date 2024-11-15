import { withValidation } from 'next-validations';
import { z } from 'zod';
import ApiError from '../errors/apiError';

// ================ Validation Profile Schemas ================
const userIdSchema = z.object({
  id: z.string().refine((val) => val.length > 0),
});

export const validateUserId = withValidation({
  schema: userIdSchema,
  type: 'Zod',
  mode: 'query',
});

export const validateUserIdPathParams = (id: string): string => {
  const result = userIdSchema.safeParse({ id });
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data.id;
};

const profileUpdateSchema = z.object({
  name: z
    .string()
    .optional()
    .refine((val) => {
      // check if val is not empty, val has max length 10 character and contains only letters, numbers, and underscores
      if (!val) return true;
      return val.length > 0 && val.length <= 10 && /^[a-zA-Z0-9_]*$/.test(val);
    }),
  bio: z.string().optional(),
});
export const validateProfileUpdate = withValidation({
  schema: profileUpdateSchema,
  type: 'Zod',
  mode: 'body',
});
