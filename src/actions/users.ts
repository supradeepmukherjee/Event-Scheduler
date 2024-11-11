'use server'

import prisma from "@/lib/prisma"
import { auth, clerkClient } from "@clerk/nextjs/server"

export async function updateUsername(username: string) {
    const { userId } = auth()
    if (!userId) throw new Error('Unauthorised')
    const existingUsername = await prisma.user.findUnique({ where: { username } })
    if (existingUsername && existingUsername.id !== userId) throw new Error('Username is already taken')
    await prisma.user.update({
        where: { clerkUserID: userId },
        data: { username }
    })
    await clerkClient.users.updateUser(userId, { username })
    return { success: true }
}

export async function getUserByUsername(username: string) {
    const user = await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            name: true,
            email: true,
            imgUrl: true,
            events: {
                where: { isPrivate: false },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    desc: true,
                    duration: true,
                    isPrivate: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: { select: { bookings: true } }
                }
            }
        }
    })
    return user
}