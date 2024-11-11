'use server'

import prisma from "@/lib/prisma"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { google } from "googleapis"

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

export async function cancelMeeting(id: string) {
    const { userId } = auth()
    if (!userId) throw new Error('Unauthorised')
    const user = await prisma.user.findUnique({ where: { clerkUserID: userId } })
    if (!user) throw new Error('User not Found')
    const meeting = await prisma.booking.findUnique({
        where: { id },
        include: {
            event: true,
            user: true
        }
    })
    if (!meeting || meeting.userID !== user.id) throw new Error('Meeting not found/Unauthorised')
    const { data } = await clerkClient.users.getUserOauthAccessToken(meeting.user.clerkUserID, 'oauth_google')
    const oAuthClient = new google.auth.OAuth2()
    oAuthClient.setCredentials({ access_token: data[0]?.token })
    await google.calendar({
        version: 'v3',
        auth: oAuthClient
    }).events.delete({
        calendarId: 'primary',
        eventId: meeting.googleEventID
    })
    return {
        success: true,
        msg: 'Event Deleted Successfully'
    }
}