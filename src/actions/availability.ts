'use server'

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type DayAvailability = {
    isAvailable: boolean
    startTime: string
    endTime: string
}

export type Availability = {
    timeGap: number
    [key: string]: number | DayAvailability
}

export async function getUserAvailability() {
    const { userId } = auth()
    if (!userId) throw new Error('Unauthorized')
    const user = await prisma.user.findUnique({
        where: { clerkUserID: userId },
        include: { availability: { include: { days: true } } }
    })
    if (!user || !user.availability) return null
    const availability: Availability = {
        timeGap: user.availability.timeGap
    };
    ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        .forEach(day => {
            const dayAvailability = user.availability?.days.find(d => d.day === day.toUpperCase())
            availability[day] = {
                isAvailable: !!dayAvailability,
                startTime:
                    dayAvailability ?
                        dayAvailability.startTime.toISOString().slice(11, 16)
                        :
                        '09:00'
                ,
                endTime:
                    dayAvailability ?
                        dayAvailability.endTime.toISOString().slice(11, 16)
                        :
                        '17:00'
                ,
            }
        })
    return availability
}