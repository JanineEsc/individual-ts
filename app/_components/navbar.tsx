import Link from "next/link"

const Navbar = () => {
  return (
    <div className="">
      <ul className="flex justify-center  text-white text-lg font-serif py-8 px-4 gap-x-3 bg-blue-950 font-bold">
        <Link href="/" >
          Home 
        </Link>
        <Link href="/create" >
          Create 
        </Link>
        <Link href="Login">
          Log in 
        </Link>
        {/* <Link href="/threads" >
          Threads
        </Link> */}
      </ul>
    </div>
  )
}
export default Navbar