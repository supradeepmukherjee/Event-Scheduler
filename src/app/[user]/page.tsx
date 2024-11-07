import { getUserByUsername } from "@/actions/users"
import EventCard from "@/components/EventCard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { notFound } from "next/navigation"

type Params = { user: string }

export async function generateMetadata({ params }: { params: Params }) {
  const user = await getUserByUsername(params.user)
  if (!user) return { title: 'User not Found' }
  return {
    title: user.name + `'s Profile | Event Scheduler`,
    description: `Book an event with ${user.name}. View available events & schedules.`
  }
}

const Page = async ({ params }: { params: Params }) => {
  const username = params.user
  const user = await getUserByUsername(username)
  if (!user) notFound()
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={user.imgUrl!} alt={user.name!} />
          <AvatarFallback>
            {user.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold mb-2">
          {user.name}
        </h1>
        <p className="text-gray-600 text-center">
          Welcome to my Scheduling Page. Please select an Event below to book a call with me
        </p>
      </div>
      {user.events.length === 0 ?
        <p className="text-center text-gray-600">
          No Public Events Available
        </p>
        :
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {user.events.map(e => <EventCard
            event={{ ...e, userID: user.id, }}
            username={username}
            key={e.id}
          />)}
        </div>
      }
    </div>
  )
}

export default Page