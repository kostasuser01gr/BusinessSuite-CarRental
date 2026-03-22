import { z } from 'zod'
import { signupSchema } from '../../../shared/schemas'

export const signupFormSchema = signupSchema
  .extend({
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type SignupFormInput = z.infer<typeof signupFormSchema>
