'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import EventForm from "./EventForm"
import { Button } from "./ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "./ui/drawer"

const CreateEvent = () => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const closeHandler = () => {
    setOpen(true)
    if (params.get('create') === 'true') router.replace(window?.location?.pathname)
  }
  useEffect(() => {
    const create = params.get('create')
    if (create === 'true') setOpen(true)
  }, [params])
  return (
    <Drawer open={open} onClose={closeHandler}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Create New Event
          </DrawerTitle>
        </DrawerHeader>
        <EventForm onSubmit={closeHandler} />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='outline' onClick={closeHandler}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateEvent