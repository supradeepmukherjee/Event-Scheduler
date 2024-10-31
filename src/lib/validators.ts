import { z } from "zod";

const usernameSchema = z.object({ username: z.string().min(4).max(32).regex(/^[a-zA-Z0-9_]+$/, 'Username can contain Letters, Numbers & Underscore only') })

const eventSchema = z.object({
    title: z.string().min(1, 'Title can\'t be empty').max(100, 'Title can be of atmost 100 characters'),
    desc: z.string().min(10, 'Description must be of atleast 10 characters').max(500, 'Description can be of atmost 100 characters'),
    duration: z.number().int().nonnegative('Duration can\'t be less than 1'),
    isPrivate: z.boolean()
})

export { usernameSchema, eventSchema }