type ThreadCategory = "Thread" | "QNA"

type User = {
  userName: string,
  password: string,  
}

type Thread =  {
  id: string;
	title: string;
	category: ThreadCategory;
	creationDate: string;
	description: string;
	creator: User;
  comments: ThreadComment[]; 
  locked?: booelean; 
  
  
}

type QNAThread = Thread & {
  category: "QNA";
  isAnswered: boolean;
  commentAnswerId?: number;
  
}

type ThreadComment = {
  id: string;
  thread: string;
  content: string;
  creator: User;
  replies?: ThreadComment[];
  likes?: number;
  isAnswer: boolean;

}

