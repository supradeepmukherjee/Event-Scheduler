import { getUserEvents } from "@/actions/events"
import EventCard from "@/components/EventCard"
import { Suspense } from "react"

const Events = async () => {
  const { events, username } = await getUserEvents()
  if (events.length == 0) return (
    <p>
      You haven&apos;t created any Event yet.
    </p>
  )
  return (
    <Suspense fallback={
      <div>
        Loading Events...
      </div>
    }>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {events.map(e => <EventCard key={e.id} event={e} username={username} />)}
      </div>
    </Suspense>
  )
}

export default Events