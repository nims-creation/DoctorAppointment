import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters long")
});

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(1, "Password is required")
});

export const updateProfileSchema = z.object({
    userId: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters long"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string(), // it's sent as a JSON string from frontend
    dob: z.string(),
    gender: z.enum(["Male", "Female", "Not Selected"])
});
