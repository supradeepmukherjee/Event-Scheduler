import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex justify-center pt-20'>
      {children}
    </div>
  )
}

export default Layout