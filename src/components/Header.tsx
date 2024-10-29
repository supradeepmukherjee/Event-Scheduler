import { checkUser } from '@/lib/checkUser'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { PenBox } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import UserMenu from './UserMenu'

const Header = async() => {
  await checkUser()
  return (
    <nav className='mx-auto py-2 px-4 flex justify-between items-center shadow-md border-b-2'>
      <Link href='/' className='flex items-center'>
        <Image alt='Logo' src='/logo.png' className='h-16 w-auto' width={150} height={64} />
      </Link>
      <div className="flex items-center gap-4">
        <Link href='/events?create=true'>
          <Button className='flex items-center gap-2'>
            <PenBox size={18} />Create Event
          </Button>
        </Link>
        <SignedOut>
          <SignInButton forceRedirectUrl='/dashboard'>
            <Button variant='outline'>
              Login
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>
    </nav>
  )
}

export default Header