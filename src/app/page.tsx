import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, Clock, LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Testimonials from '../components/Testimonials'

const features = [
  {
    icon: Calendar,
    title: 'Create Events',
    desc: 'Easily Create and Modify Event Types'
  },
  {
    icon: Clock,
    title: 'Manage Availability',
    desc: 'Manage your availability by prioritizing events'
  },
  {
    icon: LinkIcon,
    title: 'Custom Links',
    desc: 'Share your customized event Links'
  },
]

const howItWorks = [
  {
    step: 'Sign Up',
    desc: 'Create your Free Account'
  },
  {
    step: 'Set Availability',
    desc: 'Define when you\'re available for an event'
  },
  {
    step: 'Share your Link',
    desc: 'Send your Event Link to the ones to your loved ones'
  },
  {
    step: 'Get Booked',
    desc: 'Receive confirmations for scheduled Events automatically'
  },
]

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-between lg:flex-row gap-12 mb-24">
        <div className="lg:w-1/2">
          <h1 className='text-7xl font-extrabold pb-6 gradient-title leading-tight'>
            Simplify Your Life by Easily Scheduling Events
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Managing time effectively can be a challenge, but simplifying your schedule is a powerful way to make life easier and reduce stress. Start by using Event Scheduler
          </p>
          <Link href='/dashboard'>
            <Button size='lg' className="text-lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="lg:w-1/2 flex justify-between">
          <div className="relative w-full max-w-md aspect-square ">
            <Image src='/poster.jpg' alt="Poster" layout="fill" objectFit="contain" />
          </div>
        </div>
      </div>
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <Card key={i}>
              <CardHeader>
                <f.icon className="w-12 h-12 text-blue-500 mb-4 mx-auto" />
                <CardTitle className="text-center text-gray-600">
                  {f.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  {f.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">
          What our Users Say
        </h2>
        <Testimonials />
      </div>
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">
          How it Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((h, i) => (
            <div className="text-center" key={i}>
              <div className="bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {h.step}
              </h3>
              <p className="text-gray-600">
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Want to Simplify your life by Simplifying Event Scheduling?
        </h2>
        <p className='text-xl mb-6'>
          Join Professionals who have made their life Easy by trusting Event Scheduler for efficient Time Management
        </p>
        <Link href='/dashboard'>
          <Button size='lg' variant='secondary' className='text-blue-600'>
            Start for Free <ArrowRight className='ml-2 h-5 w-5' />
          </Button>
        </Link>
      </div>
    </main>
  )
}