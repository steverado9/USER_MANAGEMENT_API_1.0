import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.object({}).passthrough().optional(),
  phone: z.string().optional(),
  website: z.string().url("Invalid website URL").optional(),
  company: z.object({}).passthrough().optional(),
  roles: z
    .array(z.enum(["user", "admin", "moderator"]))
    .optional(), // roles must be one of those 3 if provided
});
console.log(signupSchema.safeParse({ password: "" }));

export const signinSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  username: z.string().min(3).optional(),
  email: z.string().email("Invalid email").optional(),
  password: z.string().min(6).optional(),
  address: z.object({}).passthrough().optional(),
  phone: z.string().optional(),
  website: z.string().url("Invalid website URL").optional(),
  company: z.object({}).passthrough().optional(),
  roles: z.array(z.enum(["user", "admin", "moderator"])).optional(),
});
