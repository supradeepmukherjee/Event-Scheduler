'use client'

import { Availability } from "@/actions/availability"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { availabilitySchema } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, FieldErrorsImpl, useForm } from "react-hook-form"

const timeSlots = ["00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"]

const Availability_ = ({ initialData }: { initialData: Availability }) => {
  const { control, handleSubmit, register, setValue, watch, formState: { errors } } = useForm<
    Availability & { [key: string]: any }
  >({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { ...initialData }
  })
  return (
    <form>
      {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        .map(d => (
          <div key={d} className="flex items-center space-x-4 mb-4">
            <Controller
              name={d + ".isAvailable"}
              control={control}
              render={({ field }) =>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={c => {
                    setValue(`${d}.isAvailable` as const, c)
                    if (!c) {
                      setValue(`${d}.startTime` as const, '09:00')
                      setValue(`${d}.endTime` as const, '17:00')
                    }
                  }}
                />}
            />
            <span className="w-24 capitalize">
              {d}
            </span>
            {watch(d + ".isAvailable") &&
              <>
                <Controller
                  name={d + ".startTime"}
                  control={control}
                  render={({ field }) =>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder='Start Time' />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(t => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>}
                />
                <span>
                  to
                </span>
                <Controller
                  name={d + ".endTime"}
                  control={control}
                  render={({ field }) =>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder='End Time' />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(t => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>}
                />
                {(errors[d] as FieldErrorsImpl<{ endTime: { message: string } }>)?.endTime && (
                  <span className="text-red-500 text-sm ml-2">
                    {(errors[d] as FieldErrorsImpl<{ endTime: { message: string } }>)?.endTime?.message as string}
                  </span>
                )}
              </>}
          </div>
        )
        )}
      <div className="flex items-center space-x-4">
        <span className="w-48">
          Minimum Gap before booking (minutes)
        </span>
        <Input type="number" {...register('timeGap', { valueAsNumber: true })} className="w-32" />
        {errors?.timeGap &&(
          <span className="text-red-500 text-sm ml-2">
            {errors?.timeGap.message}
          </span>
        )}
      </div>
      <Button type="submit" className="mt-5">
        Update Availability
      </Button>
    </form>
  )
}

export default Availability_