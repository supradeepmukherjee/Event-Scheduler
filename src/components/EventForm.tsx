'use client'

import useFetch from "@/hooks/useFetch"
import { eventSchema } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { createEvent } from "@/actions/events"
import { useRouter } from "next/navigation"

const EventForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const { refresh } = useRouter()
  const { handleSubmit, register, control, formState: { errors } } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      duration: 30,
      isPrivate: true,
      title: '',
      desc: ''
    }
  })
  const { data, error, fn, loading } = useFetch(createEvent)
  const submitHandler = async () => {
    await fn(data)
    if (!loading && !error) onSubmit()
    refresh()
  }
  return (
    <form className="px-5 flex flex-col gap-4" onSubmit={submitHandler}>
      <div className="">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Event Title
        </label>
        <Input id='title' {...register('title')} className="mt-1" />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">
            {errors.title.message}
          </p>
        )}
      </div>
      <div className="">
        <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
          Event Description
        </label>
        <Input id='desc' {...register('desc')} className="mt-1" />
        {errors.desc && (
          <p className="text-red-500 text-sm mt-1">
            {errors.desc.message}
          </p>
        )}
      </div>
      <div className="">
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Event Duration(minutes)
        </label>
        <Input id='duration' {...register('duration', { valueAsNumber: true })} className="mt-1" type="number" />
        {errors.duration && (
          <p className="text-red-500 text-sm mt-1">
            {errors.duration.message}
          </p>
        )}
      </div>
      <div className="">
        <label htmlFor="isPrivate" className="block text-sm font-medium text-gray-700">
          Event Privacy
        </label>
        <Controller control={control} name="isPrivate" render={({ field }) => (
          <Select value={field.value ? 'true' : 'false'} onValueChange={v => field.onChange(v === 'true')}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder='Select Privacy' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">
                Private
              </SelectItem>
              <SelectItem value="false">
                Public
              </SelectItem>
            </SelectContent>
          </Select>
        )} />
        {errors.isPrivate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.isPrivate.message}
          </p>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error.message}
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating Event...' : 'Create Event'}
      </Button>

    </form>
  )
}

export default EventForm