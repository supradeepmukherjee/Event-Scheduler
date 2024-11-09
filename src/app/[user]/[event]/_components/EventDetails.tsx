import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Event } from "@prisma/client"
import { Calendar, Clock } from "lucide-react";

type EventProp = Event & {
  user: {
    email: string;
    name: string | null;
    imgUrl: string | null;
  }
}

const EventDetails = (
  { event, username }
    :
    {
      event: EventProp
      username: string
    }
) => {
  const { user } = event
  return (
    <div className="p-10 lg:w-1/3 bg-white">
      <h1 className="text-3xl font-bold mb-4">
        {event.title}
      </h1>
      <div className="flex items-center mb-4">
        <Avatar className="w-24 h-24 mr-4">
          <AvatarImage src={user.imgUrl!} alt={user.name!} />
          <AvatarFallback>
            {user.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">
            {user.name}
          </h2>
          <p className="text-gray-600">
            @{username}
          </p>
        </div>
      </div>
      <div className="flex items-center mb-2">
        <Clock className="mr-2" />
        <span>
          {event.duration} Minutes
        </span>
      </div>
      <div className="flex items-center mb-4">
        <Calendar className="mr-2" />
        <span>
          Google Meet
        </span>
      </div>
      <p className="text-gray-700">
        {event.desc}
      </p>
    </div>
  )
}

export default EventDetails