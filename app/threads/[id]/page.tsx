"use client";

import Navbar from '@/app/_components/navbar';
import { auth, db } from '@/firebase/config';
import useAuth from '@/lib/useAuth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { onAuthStateChanged } from 'firebase/auth';

const ThreadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comment, setComment] = useState<string>("");
  const [checkAnswer, setCheckAnswer] = useState<string | null>(null)
  const [reply, setReply] = useState<{ [key: string]: string }>({});
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const user = useAuth();


  useEffect(() => {
    const fetchThread = async () => {
      if (id) {
        const threadDoc = await getDoc(doc(db, 'threads', id));
        if (threadDoc.exists()) {
          setThread(threadDoc.data() as Thread);
        } else {
          console.error('Thread not found');
        }
      }
    };

    fetchThread();
  }, [id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  // Commenting on the thread
  const handleAddComment = async () => {
    if (user && thread && comment) {
      const newComment: ThreadComment = {
        id: Math.random().toString(36).substring(2, 9), // generates a random string ID
        thread: thread.id,
        content: comment,
        creator: { userName: user.displayName || "Anonymous", password: "" }, // Check it later
        replies: [], // initialize replies array
        likes: 0,
        isAnswer: false
      };

      const updatedThread = {
        ...thread,
        comments: [...thread.comments, newComment],
      };

      try {
        const docRef = doc(db, 'threads', thread.id);
        await updateDoc(docRef, { comments: updatedThread.comments });
        setThread(updatedThread);
        setComment(""); // Clear the comment input after adding
      } catch (error) {
        console.error("Error updating thread in Firestore:", error);
      }
    }
  };

  // Handling reply to a comment
  const handleReply = async (commentId: string) => {
    if (user && thread && reply[commentId]) {
      const newReply = {
        id: Math.random().toString(36).substring(2, 9),
        content: comment,
        creator: { userName: user.displayName || "Anonymous", password: "" },
        replies: [],
        like: 0

      };

      const updatedComments = thread.comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      });

      const updatedThread = { ...thread, comment: updatedComments };

      try {
        const docRef = doc(db, 'threads', thread.id);
        await updateDoc(docRef, { comments: updatedThread.comments });
        setThread(updatedThread); // Update local thread state with the new reply
        setReply((prev) => ({ ...prev, [commentId]: "" })); // Clear the reply input after replying
      } catch (error) {
        console.error("Error replying to comment:", error);
      }
    }
  };

  const toggleCheck = async (commentId: string) => {
    if (!thread) return;

    const updatedComments = thread.comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, isAnswer: !comment.isAnswer };
      } else {
        return { ...comment, isAnswer: false };
      }
    });

    const updatedThread = { ...thread, comments: updatedComments };
    setThread(updatedThread);

    try {
      await updateDoc(doc(db, 'threads', thread.id), { comments: updatedComments });
      setCheckAnswer((prev) => (prev === commentId ? null : commentId));
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  if (!thread) {
    return <p className="text-red-500 text-center text-8xl">Thread not found.</p>;
  }

  return (
    <body className="bg-gray-950 h-screen font-serif">
      <Navbar />
      <main className="flex items-center justify-center p-10">
        <div className="grid-cols-1 md:grid-cols-2">
          <div className="flex items-center justify-center flex-col">
            <div className="w-[700px] bg-gray-950 shadow-xl mt-3 p-9 rounded">
              <h1 className="font-bold text-center mt-7 text-5xl text-white">{thread?.title}</h1>
              <p className="font-bold text-start text-2xl mt-10 py-3 text-white">{thread?.description}</p>
              <p className="text-sm m-2 text-right text-gray-500 font-bold">
                {thread && new Date(thread.creationDate).toLocaleString()}
              </p>

              {thread?.locked && (
                <div className="text-red-700 p-2 rounded mt-2">
                  <p className="text-center font-bold text-sm">This thread is locked. You cannot comment or reply.</p>
                </div>
              )}

              <hr className="mt-4" />
              <div className="my-4 p-9">
                {thread?.comments.map((comment) => (
                  <div key={comment.id} className="mb-4">
                    <p className="bg-slate-200 rounded p-3 text-teal-900 font-semibold">
                      {comment.content}
                      {comment.isAnswer && <CheckIcon className="text-green-600 ml-2 float-right" />}
                    </p>
                    <p className="text-white text-sm flex p-1 justify-between ">
                      {comment.creator.userName}
                      {thread.category === 'QNA' && isLoggedIn && !thread.locked && (
                        <button
                          className="flex items-center bg-gray-950 float right"
                          onClick={() => toggleCheck(comment.id)}
                        >
                          {comment.isAnswer ? 'Remove answer' : 'Mark as answer'}
                        </button>
                      )}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Replies: {comment.replies ? comment.replies.length : 0}
                    </p>
                    <p className="text-gray-400 text-xs">Likes: {comment.likes || 0}</p>

                    {/* Replies */}
                    <div className="ml-6 mt-2 border-l-2 pl-4 border-gray-300">
                      {comment.replies &&
                        comment.replies.map((reply) => (
                          <div key={reply.id} className="ml-2 mt-2 bg-gray-100 rounded p-2 shadow-md">
                            <p className="text-gray-900">{reply.content}</p>
                            <p className="text-gray-500 text-xs">- {reply.creator.userName}</p>
                          </div>
                        ))}
                    </div>

                    {/* Reply textarea and button */}
                    {isLoggedIn && !thread.locked && (
                      <div className="mt-3 ml-6">
                        <textarea
                          className="w-full p-2 bg-gray-800 text-white rounded-lg"
                          placeholder="Write your reply..."
                          value={reply[comment.id] || ""}
                          onChange={(e) => setReply({ ...reply, [comment.id]: e.target.value })}
                        />
                        <button
                          className="mt-2 bg-emerald-500 text-white px-3 py-1 rounded-md hover:bg-emerald-700"
                          onClick={() => handleReply(comment.id)}
                        >
                          Reply
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <hr className="mt-7" />

                {/* Comment Input */}
                {isLoggedIn && !thread.locked && (
                  <div className="relative flex items-center right-5 mt-2 w-[600px]">
                    <textarea
                      className="text-white m-4 p-5 rounded-md w-[800px] h-[80px] border  bg-gray-800"
                      placeholder="Write your comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      className="text-emerald-500 rounded-md px-5 w-13 h-[50px] hover:bg-emerald-800 bg-white absolute right-9"
                      onClick={handleAddComment}
                      title={!user ? "You must be logged in" : ""}
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </body>
  );
};

export default ThreadDetail;


