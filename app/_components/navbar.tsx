'use client'

import SignOutButton from "@/components/SignOutButton"
import useAuth from "@/lib/useAuth"
import Link from "next/link"




const Navbar = () => {

  const user = useAuth()



  return (
    <div className="bg-gray-950">
      <ul className="flex rounded justify-center text-white text-lg font-serif py-7 px-3 gap-x-4 bg-gray-950 font-bold">
        <Link href="/" >
          Home
        </Link>
        <Link href="/create" >
          Create
        </Link>
        {user ? (
          <SignOutButton />
        ) : (
          <Link href="Login">Log in</Link>
        )}
      </ul>
    </div>
  )
}
export default Navbar