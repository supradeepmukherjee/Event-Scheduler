'use server'

import prisma from "@/lib/prisma"
import { auth, clerkClient } from "@clerk/nextjs/server"

export async function updateUsername(username: string) {
    const { userId } = auth()
    if (!userId) throw new Error('Unauthorised')
    const existingUsername = await prisma.user.findUnique({
        where: { username }
    })
    if (existingUsername?.id !== userId) throw new Error('Username is already taken')
    await prisma.user.update({
        where: { clerkUserID: userId },
        data: { username }
    })
    await clerkClient.users.updateUser(userId, { username })
    return { success: true }
}