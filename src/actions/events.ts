'use server'

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { Event } from "@prisma/client"

export async function createEvent(data: Event) {
    const { userId } = auth()
    if (!userId) throw new Error('Unauthorised')
    const user = await prisma.user.findUnique({ where: { clerkUserID: userId } })
    if (!user) throw new Error('User not Found')
    const event = await prisma.event.create({
        data: {
            ...data,
            userID: user.id
        }
    })
    return { success: true, event }
}

export async function getUserEvents() {
    const { userId } = auth()
    if (!userId) throw new Error('Unauthorised')
    const user = await prisma.user.findUnique({ where: { clerkUserID: userId } })
    if (!user) throw new Error('User not Found')
    const events = await prisma.event.findMany({
        where: { userID: user.id },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { bookings: true } } }
    })
    return { success: true, events, username: user.username }
}