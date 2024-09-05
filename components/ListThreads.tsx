
import Link from 'next/link';
import React, { useEffect, useState } from 'react';


function ListThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedThreads = localStorage.getItem('threads');
    if (savedThreads) {
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
                    {/* <p className="mt-2 text-sm">{thread.description}</p> */}
                    <button
                      className="mt-2 bg-red-500 text-sm text-white px-3  rounded "
                      onClick={() => deleteThread(thread.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
        </div>
      </div>
    </main>
  );
}

export default ListThreads;