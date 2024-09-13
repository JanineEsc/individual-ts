import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';



const ListThreads = () => {
  const [threads, setThreads] = useState<QNAThread[]>([]);
  const [error, setError] = useState<string | null>(null);
  const user = true; // Replace with actual user authentication logic

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'threads'));
        const threadsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QNAThread[];
        setThreads(threadsData);
      } catch (error) {
        console.error('Error fetching threads from Firestore:', error);
        setError('Error fetching threads from Firestore.');
      }
    };

    fetchThreads();
  }, []);



  const deleteThread = async (id: string) => {
    try {
      const threadRef = doc(db, 'threads', id);
      await deleteDoc(threadRef);
      const updatedThreads = threads.filter(thread => thread.id !== id);
      setThreads(updatedThreads);
    } catch (error) {
      console.error('Error deleting thread:', error);
      setError('Error deleting thread.');
    }
  };


  const toggleLock = async (threadId: string, isLocked: boolean) => {
    try {
      const docRef = doc(db, 'threads', threadId);
      await updateDoc(docRef, { locked: !isLocked });
      const updatedThreads = threads.map(thread =>
        thread.id === threadId ? { ...thread, locked: !isLocked } : thread
      );
      setThreads(updatedThreads);
    } catch (error) {
      setError('Error locking/unlocking thread');
      console.error('Error locking/unlocking thread:', error);
    }
  };





  return (
      <div>
        {error ? (
          <p className="text-red-500 text-xs italic">{error}</p>
        ) : (
          threads.map(thread => (
            <div key={thread.id} className="flex justify-between rounded items-center mb-4 p-6 border bg-gray-600 text-white w-[600px]">
              <div className="">
              <Link href={`/threads/${thread.id}`}>{thread.title}</Link>
              <p className="mt-2 text-sm">{thread.category}</p>
              <p className="mt-2 text-sm">{thread.description}</p>
              <p className="text-sm text-slate-500">{new Date(thread.creationDate).toLocaleString()}</p>
              </div>
              <div className="">
              <button onClick={() => toggleLock(thread.id, thread.locked)} className="text-black py-3">
                {thread.locked ? <LockIcon /> : <LockOpenIcon />}
              </button>
                
              </div>
            </div>
          ))
        )}
      </div>
  );
}

export default ListThreads;