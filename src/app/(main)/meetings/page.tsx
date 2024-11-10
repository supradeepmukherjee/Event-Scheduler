import { getUserMeetings } from "@/actions/meeting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Suspense } from "react";
import MeetingList from "./_components/MeetingList";

export const metadata = {
  title: 'Your Meetings | Event Scheduler',
  description: 'View and manage your upcoming & past meetings'
}

const Upcoming = async () => {
  const meetings = await getUserMeetings('upcoming')
  return <MeetingList meetings={meetings} type="upcoming" />
}

const Past = async () => {
  const meetings = await getUserMeetings('past')
  return <MeetingList meetings={meetings} type="past" />
}

const Page = () => (
  <Tabs defaultValue="upcoming">
    <TabsList>
      <TabsTrigger value="upcoming">
        Upcoming
      </TabsTrigger>
      <TabsTrigger value="past">
        Past
      </TabsTrigger>
    </TabsList>
    <TabsContent value="upcoming">
      <Suspense fallback={<div>Loading Upcoming meetings...</div>}>
        <Upcoming />
      </Suspense>
    </TabsContent>
    <TabsContent value="past">
      <Suspense fallback={<div>Loading Past meetings...</div>}>
        <Past />
      </Suspense>
    </TabsContent>
  </Tabs>
)

export default Page