'use client'

import { bookingSchema } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { Booking, Event } from "@prisma/client"
import { useEffect, useState } from "react"
import { DayPicker } from "react-day-picker"
import { useForm } from "react-hook-form"
import 'react-day-picker/style.css'
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import useFetch from "@/hooks/useFetch"
import { createBooking } from "@/actions/booking"

const BookingForm = (
  { event, availability }
    :
    {
      event: Event
      availability: {
        date: string
        slots: string[]
      }[]
    }
) => {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<null | string>(null)
  const { formState: { errors }, handleSubmit, register, setValue } = useForm<{
    name: string,
    email: string,
    additionalInfo: string,
    date: string | undefined,
    time: null | string,
  }>({ resolver: zodResolver(bookingSchema) })
  const { data, error, fn, loading } = useFetch<{ meetLink?: string }>(createBooking)
  const onSubmit = async (d: {
    name: string,
    email: string,
    additionalInfo: string,
  }) => {
    if (!date || !time) return
    const start = new Date(`${format(date, 'yyyy-MM-dd')}T${time}`)
    const end = new Date(start.getTime() + event.duration * 60000)
    await fn({
      eventID: event.id,
      name: d.name,
      email: d.email,
      additionalInfo: d.additionalInfo,
      start: start.toISOString(),
      end: end.toISOString(),
    })
  }
  useEffect(() => {
    if (date) setValue('date', format(date, 'yyyy-MM-dd'))
  }, [date, setValue])
  useEffect(() => {
    if (time) setValue('time', time)
  }, [time, setValue])
  if (data) return (
    <div className="text-center p-10 border bg-white">
      <h2 className="text-2xl font-bold mb-4">
        Booked Successfully!
      </h2>
      {data && "meetLink" in data && (
        <p>
          Join the meeting:
          <a href={data.meetLink} target="_blank" rel='noopener noreferrer' className="text-blue-500 hover:underline">
            {data.meetLink}
          </a>
        </p>
      )}
    </div>
  )
  return (
    <div className="flex flex-col gap-8 p-10 border bg-white">
      <div className="md:h-96 flex flex-col md:flex-row gap-5">
        <div className="w-full">
          <DayPicker
            mode="single"
            selected={date}
            disabled={[{ before: new Date() }]}
            modifiers={{ availability: availability.map(d => new Date(d.date)) }}
            modifiersStyles={{
              availability: {
                background: 'lightgreen',//
                borderRadius: 100
              }
            }}
            onSelect={d => {
              setDate(d)
              setTime(null)
            }}
          />
        </div>
        <div className="w-full h-full md:overflow-scroll no-scroll">
          {date && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Available Time Slots
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {(date ? availability.find(d => d.date === format(date, 'yyyy-MM-dd'))?.slots || [] : []).map(s => (
                  <Button key={s} onClick={() => setTime(s)} variant={time === s ? 'default' : 'outline'}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {time &&
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="">
            <Input {...register('name')} placeholder='Your Name' />
            {errors.name && (
              <p className="text-red-500 text-sm">
                {errors.name?.message as string}
              </p>
            )}
          </div>
          <div className="">
            <Input {...register('email')} placeholder='Your Email' type='email' />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email?.message as string}
              </p>
            )}
          </div>
          <div className="">
            <Textarea {...register('additionalInfo')} placeholder='Additional Information' />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email?.message as string}
              </p>
            )}
          </div>
          <Button type="submit" disabled={loading} className='w-full'>
            {loading ? 'Scheduling...' : 'Schedule Event'}
          </Button>
        </form>}
    </div>
  )
}

export default BookingForm