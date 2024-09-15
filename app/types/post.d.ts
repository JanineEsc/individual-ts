// Dette är type defitioner


type ThreadCategory = "Thread" | "QNA"   // Detta definierar en typ som kan vara antingen "Thread" eller "QNA". Det används för att ange vilken kategori en tråd tillhör.


//Denna typ representerar en användare med ett användarnamn och ett lösenord.
type User = {
  userName: string,
  password: string,  
}

//Detta beskriver en tråd med ett unikt ID

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

//Denna typ är en utökning av Thread som specifikt gäller för Q&A-trådar. Här är category alltid "QNA", med extra egenskaper som isAnswered och commentAnswerId.

type QNAThread = Thread & {
  category: "QNA";
  isAnswered: boolean;
  commentAnswerId?: number;
  
}

//Detta definierar en kommentar på en tråd med ett unikt ID, vilken tråd den tillhör, innehåll, skapare (en User) och eventuella svar och gillningar. isAnswer indikerar om kommentaren är en svar på en fråga.

type ThreadComment = {
  id: string;
  thread: string;
  content: string;
  creator: User;
  replies?: ThreadComment[];
  likes?: number;
  isAnswer: boolean;

}

