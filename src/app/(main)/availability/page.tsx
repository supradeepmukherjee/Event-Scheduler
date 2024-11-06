import { getUserAvailability } from "@/actions/availability"
import { Suspense } from "react"
import Availability from "./_components/Availability"

const Page = async () => {
  const availability = await getUserAvailability()
  return (
    <div className="mx-auto">
      <Suspense fallback={<></>}>
        <Availability
          initialData={
            availability
            ||
            {
              monday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
              tuesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
              wednesday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
              thursday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
              friday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
              saturday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
              sunday: { isAvailable: false, startTime: "09:00", endTime: "17:00" },
              timeGap: 0,
            }
          } />
      </Suspense>
    </div>
  )
}

export default Page