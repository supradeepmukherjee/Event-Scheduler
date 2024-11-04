'use client'

import { delEvent } from "@/actions/events";
import useFetch from "@/hooks/useFetch";
import { Event } from "@prisma/client";
import { Link, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

type EventWithCount = Event & { _count: { bookings: number } };

const EventCard = (
  { event, username, isPublic = false }
    :
    {
      event: EventWithCount
      username: string
      isPublic?: boolean
    }
) => {
  const [copied, setCopied] = useState(false)
  const { refresh } = useRouter()
  const { fn, loading } = useFetch(delEvent)
  const copyHandler = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${username}/${event.id}`)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2300);
    } catch (err) {
      console.log(err)
    }
  }
  const delHandler = async () => {
    if (window?.confirm('Are you sure you want to DELETE this Event?')) await fn(event.id)
    refresh()
  }
  return (
    <Card className="flex flex-col justify-between cursor-pointer">
      <CardHeader>
        <CardTitle className="text-2xl">
          {event.title}
        </CardTitle>
        <CardDescription className="flex justify-between">
          <span>
            {event.duration} Minutes | {event.isPrivate ? 'Private' : 'Public'}
          </span>
          <span>
            {event._count.bookings} Bookings
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {event.desc?.substring(0, event.desc.indexOf('.'))}
        </p>
      </CardContent>
      {!isPublic &&
        <CardFooter className="flex gap-2">
          <Button variant='outline' className="flex items-center" onClick={copyHandler}>
            <Link className="mr-2 h-4 w-4" /> {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button variant='destructive' onClick={delHandler} disabled={loading}>
            <Trash className="mr-2 h-4 w-4" /> {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </CardFooter>}
    </Card>
  )
}

export default EventCard