"use client";

import Navbar from '@/app/_components/navbar';
import useAuth from '@/lib/useAuth';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ThreadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comment, setComment] = useState<string>("");
  const [reply, setReply] = useState<{ [key: number]: string }>({});
  const user = useAuth();

  useEffect(() => {
    console.log("Thread ID from URL:", id);

    if (id) {
      const savedThreads = localStorage.getItem('threads');
      if (savedThreads) {
        const threads: Thread[] = JSON.parse(savedThreads);
        const idNumber = parseInt(id, 10);
        const foundThread = threads.find(thread => thread.id === idNumber);
        setThread(foundThread || null);
      }
    }
  }, [id]);

  const handleAddComment = () => {
    if (user && thread && comment) {
      const newComment: ThreadComment = {
        id: Date.now(),
        thread: thread.id,
        content: comment,
        creator: { userName: user.displayName || "Anonymous", password: "" }
      };

      const updatedThread = {
        ...thread,
        comments: [...thread.comments, newComment]
      };

      const savedThreads = localStorage.getItem('threads');
      if (savedThreads) {
        const threads: Thread[] = JSON.parse(savedThreads);
        const updatedThreads = threads.map(t => t.id === thread.id ? updatedThread : t);
        localStorage.setItem('threads', JSON.stringify(updatedThreads));
        setThread(updatedThread);
        setComment("");
      }
    }
  };

  const handleAddReply = (commentId: number) => {
    if (user && thread && reply[commentId]) {
      const newReply: ThreadComment = {
        id: Date.now(),
        thread: thread.id,
        content: reply[commentId],
        creator: { userName: user.displayName || "Anonymous", password: "" },
        likes: 0
      };

      const updatedComments = thread.comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      });

      const updatedThread = {
        ...thread,
        comments: updatedComments
      };

      const savedThreads = localStorage.getItem('threads');
      if (savedThreads) {
        const threads: Thread[] = JSON.parse(savedThreads);
        const updatedThreads = threads.map(t => t.id === thread.id ? updatedThread : t);
        localStorage.setItem('threads', JSON.stringify(updatedThreads));
        setThread(updatedThread);
        setReply({ ...reply, [commentId]: "" });
      }
    }
  };

  const handleLikeComment = (commentId: number) => {
    if (thread) {
      const updatedComments = thread.comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: (comment.likes || 0) + 1
          };
        }
        return comment;
      });

      const updatedThread = {
        ...thread,
        comments: updatedComments
      };

      const savedThreads = localStorage.getItem('threads');
      if (savedThreads) {
        const threads: Thread[] = JSON.parse(savedThreads);
        const updatedThreads = threads.map(t => t.id === thread.id ? updatedThread : t);
        localStorage.setItem('threads', JSON.stringify(updatedThreads));
        setThread(updatedThread);
      }
    }
  };

  if (!thread) {
    return <p className="text-red-500 text-center text-8xl">Thread not found.</p>;
  }

  return (
    <body className="bg-blue-950 h-screen font-serif">
      <Navbar />
      <main className="flex items-center justify-center p-10">
        <div className="grid-cols-1 bg-blue md:grid-cols-2">
          <div className="flex items-center justify-center flex-col">
            <div className="w-[700px] border-2 shadow-xl border-opacity-50 mt-3 p-9 rounded">
              <h1 className="font-bold text-center mt-7 text-5xl text-white">{thread.title}</h1>
              <p className="font-bold text-start text-2xl mt-10 py-3 text-white">{thread.description}</p>
              <p className="text-sm m-2 text-right text-gray-500 font-bold">{new Date(thread.creationDate).toLocaleString()}</p>
              <hr className="mt-4" />
              <div className="my-4 p-9">
                {thread.comments.map(comment => (
                  <div key={comment.id} className="mb-4">
                    <p className="bg-slate-200 rounded p-2 text-teal-900">{comment.content}</p>
                    <p className="text-white">{comment.creator.userName}</p>
                    <p className="text-gray-400">Replies: {comment.replies ? comment.replies.length : 0}</p>
                    <p className="text-gray-400">Likes: {comment.likes || 0}</p>
                    <button
                      className="rounded bg-green-500 text-white p-2"
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      Like
                    </button>
                    <div className="ml-4">
                      {comment.replies && comment.replies.map(reply => (
                        <div key={reply.id} className="ml-4 mt-2">
                          <p className="bg-slate-200 rounded p-2 text-teal-900">{reply.content}</p>
                          <p className="text-white">{reply.creator.userName}</p>
                          <p className="text-gray-400">Replies: {reply.replies ? reply.replies.length : 0}</p>
                          <p className="text-gray-400">Likes: {reply.likes || 0}</p>
                          <button
                            className="rounded bg-green-500 text-white p-2"
                            onClick={() => handleLikeComment(reply.id)}
                          >
                            Like
                          </button>
                        </div>
                      ))}
                      <textarea
                        className="mt-2 mb-4 bg-transparent rounded-lg w-full h-20 border p-2"
                        placeholder="Write your reply here"
                        value={reply[comment.id] || ""}
                        onChange={(e) => setReply({ ...reply, [comment.id]: e.target.value })}
                      />
                      <button
                        className="rounded bg-blue-500 text-white p-2"
                        onClick={() => handleAddReply(comment.id)}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
                <hr className="mt-7" />
                <div className='relative flex items-center right-5 mt-2 w-[600px]'>
                  <div
                    className="text-white m-4 p-5 rounded-md w-[800px] h-[80px] border border-white-300"
                    contentEditable
                    onInput={(e) => setComment((e.target as HTMLDivElement).innerText)}
                  />
                  <button
                    className="text-emerald-500 rounded-md px-5 w-13 h-[50px] hover:bg-emerald-800 bg-white absolute right-9"
                    onClick={handleAddComment}
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </body>
  );
};

export default ThreadDetail;