'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import useFetch from "@/hooks/useFetch"
import { usernameSchema } from "@/lib/validators"
import { useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { BarLoader } from "react-spinners"
import { updateUsername } from "../../../actions/users"
import { getUpdates } from "@/actions/dashboard"
import { format } from "date-fns"

const Dashboard = () => {
  const { isLoaded, user } = useUser()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<{ username: string }>({ resolver: zodResolver(usernameSchema) })
  const { error, fn, loading } = useFetch(updateUsername)
  const { data, fn: updatesFn, loading: updatesLoading } = useFetch(getUpdates)
  useEffect(() => {
    setValue('username', user?.username as string)
  }, [isLoaded])
  useEffect(() => {
    (async () => await updatesFn())()
  }, [updatesFn])//
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            Welcome, {user?.fullName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!updatesLoading ? (
            Array.isArray(data) && data?.length ? (
              <ul>
                {data?.map(m => (
                  <li key={m.id}>
                    {m.event.title} on {format(new Date(m.start),'MMM d, yyyy h:mm a')} with {m.name}
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                No Upcoming meetings
              </div>
            )
          ) : (
            <div>
              Loading Updates
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            Your Unique Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(async (data: { username: string }) => await fn(data.username))}>
            <div className="">
              <div className="flex items-center gap-2">
                <span>
                  {window?.location.origin}
                </span>
                <Input placeholder="username" {...register('username')} />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
              {error && (
                <p className="text-red-500 text-sm mt-1">
                  {error?.message}
                </p>
              )}
            </div>
            {loading && <BarLoader className="mb-4" width='100%' color="#36d7b7" />}
            <Button type="submit">
              Update Username
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard