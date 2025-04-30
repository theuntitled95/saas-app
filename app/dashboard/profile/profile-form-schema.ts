import {z} from "zod";

export const profileFormSchema = z.object({
  firstName: z.string().min(2).max(30),
  lastName: z.string().min(2).max(30),
  email: z.string().email(),
  bio: z.string().max(160).optional(),
  phone: z
    .string()
    .min(10, {message: "Phone number must be at least 10 digits."})
    .max(20, {message: "Phone number must not exceed 20 digits."})
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number.")
    .optional(),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
  language: z.string(),
  timezone: z.string(),
  avatarUrl: z.string().url().optional(),
  emailVerified: z.boolean().optional(),
  dateOfBirth: z.union([z.string(), z.date()]),
  defaultTheme: z.enum(["light", "dark", "system"]).optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
