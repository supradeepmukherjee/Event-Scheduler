'use server'

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function getUpdates() {
    const { userId } = auth()
    if (!userId) throw new Error('Unauthorised')
    const user = await prisma.user.findUnique({ where: { clerkUserID: userId } })
    if (!user) throw new Error('User not Found')
    const now = new Date()
    const meetings = await prisma.booking.findMany({
        where: {
            userID: user.id,
            start: { gte: now }
        },
        take: 3,
        include: { event: { select: { title: true } } },
        orderBy: { start: 'asc' },
    })
    return meetings
}