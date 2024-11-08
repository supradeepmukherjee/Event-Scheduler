'use server'

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { DayOfWeek } from "@prisma/client";
import { addDays, addMinutes, format, isBefore, parseISO, startOfDay } from 'date-fns'

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

export async function updateAvailability(data: Availability) {
    const { userId } = auth()
    if (!userId) throw new Error('Unauthorized')
    const user = await prisma.user.findUnique({
        where: { clerkUserID: userId },
        include: { availability: true }
    })
    if (!user) throw new Error('User not Found')
    const availability = Object.entries(data)
        .filter(([key]) => key !== 'timeGap')
        .flatMap(([day, val]) => {
            const { isAvailable, startTime, endTime } = val as DayAvailability;
            if (isAvailable) {
                const baseDate = new Date().toISOString().split('T')[0]
                return [{
                    day: DayOfWeek[day.toUpperCase() as keyof typeof DayOfWeek],
                    startTime: new Date(`${baseDate}T${startTime}:00Z`),
                    endTime: new Date(`${baseDate}T${endTime}:00Z`),
                }]
            }
            return []
        })
    if (user.availability) await prisma.availability.update({
        data: {
            timeGap: data.timeGap,
            days: {
                deleteMany: {},
                create: availability
            }
        },
        where: { id: user.availability.id }
    })
    else await prisma.availability.create({
        data: {
            userID: user.id,
            timeGap: data.timeGap,
            days: { create: availability }
        },
    })
    return { success: true }
}

export async function getEventAvailability(id: string) {
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            user: {
                include: {
                    availability: {
                        select: {
                            days: true,
                            timeGap: true,
                        }
                    },
                    bookings: {
                        select: {
                            start: true,
                            end: true
                        }
                    }
                }
            }
        }
    })
    if (!event || !event.user.availability) return []
    const { availability, bookings } = event.user
    const startDate = startOfDay(new Date())
    const endDate = addDays(startDate, 30)
    const availableDates = []
    for (let i = startDate; i <= endDate; i = addDays(i, 1)) {
        const day = format(i, 'EEEE').toUpperCase()
        if (availability.days.find(d => d.day === day)) {
            const date = format(i, 'yyyy-MM-dd')
            const slots = []
            let currentTime = parseISO(`${date}T${startDate.toISOString().slice(11, 16)}`)
            const endTime = parseISO(`${date}T${endDate.toISOString().slice(11, 16)}`)
            const now = new Date()
            if (format(now, 'yyyy-MM-dd') === date)
                currentTime = isBefore(currentTime, now) ? addMinutes(now, availability.timeGap) : currentTime
            while (currentTime < endTime) {
                const slotEnd = new Date(currentTime.getTime() + event.duration * 60000)
                const isSlotAvailable = !bookings.some(b => {
                    const bookingStart = b.start
                    const bookingEnd = b.end
                    return (
                        (currentTime >= bookingStart && currentTime < bookingEnd) ||
                        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                        (currentTime <= bookingStart && slotEnd >= bookingEnd)
                    )
                })
                if (isSlotAvailable) slots.push(format(currentTime, 'HH:mm'))
                currentTime = slotEnd
            }
            availableDates.push({ date, slots })
        }
    }
    return availableDates
}