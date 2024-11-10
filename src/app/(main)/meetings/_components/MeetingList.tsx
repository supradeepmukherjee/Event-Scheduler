import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Clock, Video } from "lucide-react";

const MeetingList = (
  { meetings, type }
    :
    {
      type: 'upcoming' | 'past'
      meetings: {
        id: string;
        name: string;
        userID: string;
        meetLink: string;
        additionalInfo: string | null;
        createdAt: Date;
        updatedAt: Date;
        start: Date;
        end: Date;
        event: {
          user: {
            name: string | null;
            email: string;
          };
          duration: number;
          isPrivate: boolean;
          desc: string | null;
          title: string;
        }
      }[]
    }
) => {
  if (meetings.length === 0) return (
    <p>
      No {type} Meetings Found
    </p>
  )
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {meetings.map(m => (
        <Card key={m.id} className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>
              {m.event.title}
            </CardTitle>
            <CardDescription>
              with {m.name}
            </CardDescription>
            <CardDescription>
              &quot;{m.additionalInfo}&quot;
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center mb-2'>
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {format(new Date(m.start), 'MMMM d, yyyy')}
              </span>
            </div>
            <div className='flex items-center mb-2'>
              <Clock className="mr-2 h-4 w-4" />
              <span>
                {format(new Date(m.start), 'h:mm a')} - {format(new Date(m.start), 'h:mm a')}
              </span>
            </div>
            {m.meetLink && (
              <div className="flex items-center">
                <Video className="mr-2 h-4 w-4" />
                <a href={m.meetLink} target='_blank' rel='noopener noreferrer' className="text-blue-500 hover:underline">
                  Join Meeting
                </a>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant='destructive'>
              Cancel Meeting
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default MeetingList