import Link from "next/link";
export default function ThreadComponent() {
    return (
        <main className="ml-5 mr-5">
            <div className="flex flex-col gap-4">
                <div className="border p-4 rounded-lg shadow-md">
                    <p>Author</p>
                    <p className="text-gray-600 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora mollitia suscipit impedit rerum porro obcaecati quibusdam aut, totam cupiditate deserunt itaque commodi nemo est. Alias fuga vero, architecto quos ipsa quas delectus quod ducimus autem error vitae tenetur commodi saepe, dolorum voluptatum. Illum veritatis maiores quisquam iste sit, error inventore.
                    </p>
                </div>
            </div>
        </main>
    );
}




// type ThreadComponentProps = {
//     thread?: Thread; 
//   };
  
//   export default function ThreadComponent({ thread }: ThreadComponentProps) {
//       if (!thread) {
//           return (
//               <main className="p-5">
//                   <h1 className="font-bold text-center text-6xl mb-4">Threads</h1>
//                   <div className="flex flex-col gap-4">
//                       <div className="border p-4 rounded-lg shadow-md">
//                           <p className="text-gray-600 mb-4">Thread data is not available.</p>
//                       </div>
//                   </div>
//               </main>
//           );
//       }
  
//       return (
//           <main className="p-5">
//               <div className="flex flex-col gap-4">
//                   <div className="border p-4 rounded-lg shadow-md">
//                       <div className="flex items-center gap-5 mb-4">
//                           <Link href={"/"} className="text-blue-500 hover:underline">Forum</Link>
//                           <p className="text-gray-700">{thread.title}</p>
//                       </div>
//                       <div className="text-gray-600 mb-4">
//                           {thread.comments.length > 0 ? (
//                               thread.comments.map((comment) => (
//                                   <div key={comment.id} className="mb-4 border-t pt-2">
//                                       <p className="text-gray-600">{comment.content}</p>
//                                       <div className="flex justify-between text-gray-500 text-sm">
//                                           <p>{comment.creator.userName}</p>
//                                       </div>
//                                   </div>
//                               ))
//                           ) : (
//                               <p>No comments available.</p>
//                           )}
//                       </div>
//                   </div>
//               </div>
//           </main>
//       );
//   }