'use server'

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function getUserMeetings(type: 'upcoming' | 'past' = 'past') {
    const { userId } = auth()
    if (!userId) throw new Error('Unauthorised')
    const user = await prisma.user.findUnique({ where: { clerkUserID: userId } })
    if (!user) throw new Error('User not Found')
    const now = new Date()
    const meetings = await prisma.booking.findMany({
        where: {
            userID: user.id,
            start: type === 'past' ? { lt: now } : { gte: now }
        },
        include: {
            event: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
                }
            },
        },
        orderBy: { start: type === 'past' ? 'desc' : 'asc' }
    })
    return meetings
}