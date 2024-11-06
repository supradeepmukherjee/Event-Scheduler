import { z } from "zod";

const usernameSchema = z.object({ username: z.string().min(4).max(32).regex(/^[a-zA-Z0-9_]+$/, 'Username can contain Letters, Numbers & Underscore only') })

const eventSchema = z.object({
    title: z.string().min(1, 'Title can\'t be empty').max(100, 'Title can be of atmost 100 characters'),
    desc: z.string().min(10, 'Description must be of atleast 10 characters').max(500, 'Description can be of atmost 100 characters'),
    duration: z.number().int().nonnegative('Duration can\'t be less than 1'),
    isPrivate: z.boolean()
})

const daySchema = z.object({
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
}).refine(
    d => {
        if (d.isAvailable) return d.startTime! < d.endTime!
        return true
    },
    {
        message: 'End Time can\'t be before Start Time',
        path: ['endTime']
    }
)

const availabilitySchema = z.object({
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema,
    sunday: daySchema,
    timeGap: z.number().min(0, 'Time Gap can\'t be negative').int()
})

export { usernameSchema, eventSchema, availabilitySchema, daySchema }