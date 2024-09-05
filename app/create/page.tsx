import CreateThread from '../../components/CreateThread';
import Navbar from "../_components/navbar";

export default function Create() {
  return (
    <div className="bg-blue-950 min-h-screen font-serif">
      <Navbar/>
        <h1 className="font-bold mt-10 font-serif text-center text-3xl text-white">Create Thread</h1>
        <div className="mt-7 w-1/2 mx-auto">
          <div className="font-bold text-start text-sm px-5">
            <CreateThread />
          </div>
        </div>
    </div>
  );
}

