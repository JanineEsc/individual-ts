'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


const CreateThread = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ThreadCategory>('Thread'); 
  const [creator, setCreator] = useState<User>({ userName: 'defaultUser', password: 'defaultPassword' }); 


  const router = useRouter();

  const handleCreateThread = () => {
    const newThread: Thread = {
      id: Math.floor(Math.random() * 10000), 
      title,
      category,
      creationDate: new Date().toISOString(),
      description,
      creator,
      comments: []
    };

    const savedThreads = localStorage.getItem('threads');
    const threads = savedThreads ? JSON.parse(savedThreads) : [];
    threads.push(newThread);
    localStorage.setItem('threads', JSON.stringify(threads));

    console.log('Saved threads:', threads);

    
    router.push('/');
  };



  return (
    <main className="bg-blue-950 border-2  flex items-center justify-center px-1 shadow-xl">
      <div className="w-[800px] h-full grid-cols-1 bg-blue md:grid-cols-2 ">
        <div className="bg-blue-950 h-full text-white pt-5 items-center justify-center ">
          <div className=" mx-auto w-full p-6 rounded ">
            <form onSubmit={(e) => { e.preventDefault(); handleCreateThread(); }}>
              <div className="mb-4">
                <label htmlFor="title" className="block mt-4 text-lg text-white ">Title:</label>
                <input
                  className="mt-2 mb-4 bg-transparent rounded-full border p-2"
                  type="text"
                  id="title"
                  placeholder="Thread name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="Category" className="block mt-4 text-lg text-white">Category:</label>
                <select
                  className="mt-2 mb-4 bg-transparent rounded-full border p-2"
                  id="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ThreadCategory)}
                >
                  <option className="bg-gray-500" value="Thread">Thread</option>
                  <option className="bg-gray-500" value="QNA">QNA</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="content" className="block mt-4 text-lg text-white">Content:</label>
                <textarea
                  className="mt-2 mb-4 bg-transparent rounded-lg w-full h-32 border p-2"
                  id="content"
                  placeholder="Write your content here"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <button type="submit" className="w-full mt-6 text-white border-2 h-12 rounded-full hover:text-emerald-400 hover:bg-white">Create new thread</button>
              </div> 
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};
export default CreateThread;
