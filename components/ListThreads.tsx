
import useAuth from '@/lib/useAuth';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';


function ListThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [error, setError] = useState<string | null>(null);
  const user = useAuth()

  useEffect(() => {
    const savedThreads = localStorage.getItem('threads');
    if (savedThreads) {

      const parsedThreads = JSON.parse(savedThreads).map((thread: Thread) => ({
        ...thread,
        locked: thread.locked || false
      }))
      setThreads(JSON.parse(savedThreads));
    } else {
      setError('Inga trådar hittades i localStorage.');
    }
  }, []);

  const deleteThread = (id: number) => {
    const updatedThreads = threads.filter(thread => thread.id !== id);
    setThreads(updatedThreads);
    localStorage.setItem('threads', JSON.stringify(updatedThreads));

    console.log('Updated threads:', updatedThreads);
  };

  const lockThread = (id: number) => {
    const updatedThreads = threads.map(thread => thread.id === id ? {
      ...thread,
      locked: true
    } : thread)

    setThreads(updatedThreads);
    localStorage.setItem('threads', JSON.stringify(updatedThreads));
  }

  const unlockThread = (id: number) => {
    const updatedThreads = threads.map(thread => thread.id === id ? {
      ...thread,
      locked: false,

    } : thread)
    setThreads(updatedThreads);
    localStorage.setItem('threads', JSON.stringify(updatedThreads));
  }

  return (
    <main className="border-2 flex items-center justify-center  bg-blue-300  rounded p-10 shadow-xl">
      <div className="">
        <div className=" text-black flex items-center justify-center bg-blue-300 flex-col">
          {error ? (
            <p className="text-red-500 text-xs italic">{error}</p>
          ) : (
            threads.map(thread => (
              <div key={thread.id} className=" justify-between rounded items-center mb-4 p-4 border border-white w-[600px]">
                <Link href={`/threads/${thread.id}`}>{thread.title}</Link>
                <p className="mt-2 text-sm">{thread.category}</p>
                <p className="text-sm text-slate-500">{new Date(thread.creationDate).toLocaleString()}</p>
                <p className="mt-2 text-sm">{thread.description}</p>
                {user && ( // Conditionally render the buttons based on user authentication status
                  <div className='flex gap-2 text-sm mt-2'>
                    {thread.locked ? (
                      <button className='rounded bg-white' onClick={() => unlockThread(thread.id)}> Unclock </button>
                    ) : (
                      <button className='rounded bg-red-500' onClick={() => lockThread(thread.id)}> Lock </button>
                    )}
                    <button onClick={() => deleteThread(thread.id)}>Delete</button>
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default ListThreads;

