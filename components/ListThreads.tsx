


import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth

const ListThreads = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); // State to store authenticated user

  useEffect(() => {
    const auth = getAuth(); // Initialize Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, set the user state
        setUser(user);
      } else {
        // User is signed out, clear the user state
        setUser(null);
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedThreads = localStorage.getItem('threads');
    if (savedThreads) {
      const parsedThreads = JSON.parse(savedThreads).map((thread: Thread) => ({
        ...thread,
        locked: thread.locked || false,
      }));
      setThreads(parsedThreads);
    } else {
      setError('No threads found in localStorage.');
    }
  }, []);

  const deleteThread = (id: number) => {
    const updatedThreads = threads.filter((thread) => thread.id !== id);
    setThreads(updatedThreads);
    localStorage.setItem('threads', JSON.stringify(updatedThreads));
    console.log('Updated threads:', updatedThreads);
  };

  const lockThread = (id: number) => {
    const updatedThreads = threads.map((thread) =>
      thread.id === id ? { ...thread, locked: true } : thread
    );
    setThreads(updatedThreads);
    localStorage.setItem('threads', JSON.stringify(updatedThreads));
  };

  const unlockThread = (id: number) => {
    const updatedThreads = threads.map((thread) =>
      thread.id === id ? { ...thread, locked: false } : thread
    );
    setThreads(updatedThreads);
    localStorage.setItem('threads', JSON.stringify(updatedThreads));
  };

  return (
    <div>
      {error ? (
        <p className="text-red-500 text-xs italic">{error}</p>
      ) : (
        threads.map((thread) => (
          <div key={thread.id} className="justify-between rounded items-center mb-4 p-4 border border-white w-[600px]">
            {thread.locked ? (
              <p className="text-red-500">This thread is locked and cannot be accessed.</p>
            ) : (
              <Link href={`/threads/${thread.id}`}>{thread.title}</Link>
            )}
            <p className="mt-2 text-sm">{thread.category}</p>
            <p className="text-sm text-slate-500">{new Date(thread.creationDate).toLocaleString()}</p>
            <p className="mt-2 text-sm">{thread.description}</p>

            {/* Conditionally render buttons based on Firebase authentication status */}
            {user && (
              <div className="flex gap-2 text-sm mt-2">
                {thread.locked ? (
                  <button className="rounded bg-white" onClick={() => unlockThread(thread.id)}>
                    Unlock
                  </button>
                ) : (
                  <button className="rounded bg-red-500" onClick={() => lockThread(thread.id)}>
                    Lock
                  </button>
                )}
                <button onClick={() => deleteThread(thread.id)}>Delete</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ListThreads;
