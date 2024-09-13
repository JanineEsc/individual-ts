'use client'
import ListThreads from "@/components/ListThreads";
import Navbar from "./_components/navbar";

export default function Home() {

  return (
    <main className="bg-gray-950 h-screen font-serif">
      <Navbar/>
      <div className="mt-2  w-1/2 mx-auto ">
        <h2 className="font-bold text-start text-3xl mt-10 text-white">Forum Threads</h2>
        <div className="font-bold text-start text-xl py-9 rounded-sm ">
            <ListThreads />
        </div>
      </div>
    </main>
  );
}
