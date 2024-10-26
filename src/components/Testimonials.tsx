'use client'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Card, CardContent } from './ui/card'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

const testimonials = [
  {
    name: "Shanti Das",
    role: "CMO",
    content: "Event Scheduler has revolutionized the way I organize my team’s meetings—it's user-friendly and saves us hours each week!",
    img: "https://img.freepik.com/free-photo/indian-ethnicity-happy-woman-portrait_53876-153598.jpg",
  },
  {
    name: "Dinesh Sen",
    role: "Graphic Designer",
    content: "As a freelancer, Event Scheduler keeps me organized and professional. My clients appreciate how simple it is to book time with me.",
    img: "https://img.freepik.com/free-photo/smiling-businessman-face-portrait-wearing-suit_53876-148138.jpg",
  },
  {
    name: "Suresh Kumar",
    role: "Founder",
    content: "Event Scheduler has streamlined our hiring process—scheduling interviews has never been simpler!",
    img: "https://img.freepik.com/free-photo/worldface-pakistani-guy-white-background_53876-14466.jpg?semt=ais_hybrid",
  },
  {
    name: "Mayank Gupta",
    role: "Sales Executive",
    content: "I've seen a 30% increase in my meeting bookings since I started using Event Scheduler. It’s a game-changer for sales professionals!",
    img: "https://img.freepik.com/free-photo/close-up-portrait-young-hindoo-man-with-beard-white-shirt-isolated-blue-wall-human-emotions-facial-expression-ad-concept-negative-space-standing-looking-calm_155003-19623.jpg",
  },
]

const Testimonials = () => (
  <Carousel className='w-full mx-auto' plugins={[Autoplay({ delay: 3300 })]}>
    <CarouselContent className=''>
      {testimonials.map(t => (
        <CarouselItem key={t.img} className='md:basis-1/2 lg:basis-1/3'>
          <Card className='h-full'>
            <CardContent className='flex flex-col h-full justify-between p-6'>
              <p className="text-gray-600 mb-4">
                &quot;{t.content}&quot;
              </p>
              <div className="flex items-center mt-4">
                <Avatar className='h-12 w-12 mr-4'>
                  <AvatarImage src={t.img} alt={t.name} />
                  <AvatarFallback>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="">
                  <p className="font-semibold">
                    {t.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CarouselItem>
      ))}
    </CarouselContent>
  </Carousel>
)

export default Testimonials