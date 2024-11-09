'use server'

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { Booking } from "@prisma/client";
import { google } from 'googleapis'

export async function createBooking(d: Booking) {
    try {
        const event = await prisma.event.findUnique({
            where: { id: d.eventID },
            include: { user: true }
        })
        if (!event) throw new Error('Event not Found')
        const { data } = await clerkClient.users.getUserOauthAccessToken(event.user.clerkUserID, `oauth_google`)
        const token = data[0]?.token
        if (!token) throw new Error('Event Creator has not connected Google Calender')
        const oAuthClient = new google.auth.OAuth2()
        oAuthClient.setCredentials({ access_token: token })
        const calender = google.calendar({
            version: 'v3',
            auth: oAuthClient
        })
        const { data: meetData } = await calender.events.insert({
            calendarId: 'primary',
            conferenceDataVersion: 1,
            requestBody: {
                start: { dateTime: d.start },
                end: { dateTime: d.end },
                description: d.additionalInfo,
                attendees: [{ email: d.email }, { email: event.user.email }],
                conferenceData: { createRequest: { requestId: `${event.id}-${Date.now()}` } },
                summary: `${d.name}: ${event.title}`
            }
        } as any)
        const meetLink = meetData?.hangoutLink as string
        const googleEventID = meetData?.id as string
        const booking = await prisma.booking.create({
            data: {
                email: d.email,
                end: d.end,
                googleEventID,
                meetLink,
                name: d.name,
                start: d.start,
                userID: event.userID,
                eventID: event.id,
                additionalInfo: d.additionalInfo
            }
        })
        return { success: true, booking, meetLink }
    } catch (err: any) {
        console.log('Failed to create booking', err)
        return {
            success: false,
            error: err.message
        }
    }
}