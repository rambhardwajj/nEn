import React from 'react'
import { Button } from './ui/button'

const Navbar = () => {
  return (
    <div className='w-full flex items-center justify-between px-3 mt-1 border-b '>
        <div>
            Your WorkFlows...
        </div>
        <div>
            <Button className='className="px-4 py-1 my-2 md:cursor-pointer border-2 border-b-3 border-neutral-800 hover:bg-[#f7f1e6] bg-white text-black hover:text-black transition-colors items-center flex rounded-md' >
                Create Workflow
            </Button>
        </div>
    </div>
  )
}

export default Navbar