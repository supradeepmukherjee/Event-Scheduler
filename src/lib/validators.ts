import { z } from "zod";

const usernameSchema = z.object({ username: z.string().min(4).max(32).regex(/^[a-zA-Z0-9_]+$/, 'Username can contain Letters, Numbers & Underscore only') })

export { usernameSchema }