import { getEventDetails } from "@/actions/events"
import { getUserByUsername } from "@/actions/users"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import EventDetails from "./_components/EventDetails"
import BookingForm from "./_components/BookingForm"
import { getEventAvailability } from "@/actions/availability"

type Params = {
  user: string
  event: string
}

export async function generateMetadata({ params }: { params: Params }) {
  const event = await getEventDetails(params.user, params.event)
  if (!event) return { title: 'Event not Found' }
  return {
    title: `Book ${event.title} with ${event.user.name} | Event Scheduler`,
    description: `Schedule a ${event.duration}-minute ${event.title} event with ${event.user.name}`
  }
}

const Page = async ({ params }: { params: Params }) => {
  const { event: event_, user } = params
  const event = await getEventDetails(user, params.event)
  const availability = await getEventAvailability(event_)
  if (!event) notFound()
  return (
    <div className="flex flex-col justify-center lg:flex-row px-4 py-8">
      <EventDetails event={event} username={user} />
      <Suspense fallback={
        <div>
          Loading Booking Form
        </div>
      }>
        <BookingForm event={event} availability={availability} />
      </Suspense>
    </div>
  )
}

export default Page