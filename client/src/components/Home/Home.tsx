import React, { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import UserContext from "../../contexts/userContext";

function Home() {
  const navigate = useNavigate();
  const { musername, setmUsername } = useContext(UserContext) || {};

  if (setmUsername) {
    setmUsername("lofad");
  }
  console.log(musername)

  const handleCreateRoom = () => {
    const roomId = v4();

    console.log("Create Room");
    toast.success("Room Created");
    navigate(`/codeEditor/${roomId}`);
  };

  type loggedIn = {
    loggedIn: boolean;
  };

  const [loggedIn, setLoggedIn] = useState<loggedIn>({ loggedIn: true });

  return (
    <>
      <div className="w-screen h-screen bg-zinc-900">
        <header>
          <nav className="flex justify-between items-center h-16 bg-zinc-900 text-white">
            <div className="pl-8 text-4xl mt-10">BroCode</div>
            <div className="pr-8 mt-10">
              {loggedIn.loggedIn === true ? (
                <>
                  <button onClick={handleCreateRoom} className="btn mr-4">
                    Create Room
                  </button>
                  <Toaster position="top-right" />
                  <button className="btn mr-4">Join Room</button>
                  <button className="btn btn-outline">Logout</button>
                </>
              ) : (
                <>
                  <button className="btn mr-4">SignUp</button>
                  <button className="btn btn-outline">Login</button>
                </>
              )}
            </div>
          </nav>
        </header>
        <main>
          <div className="flex justify-center flex-col items-center mt-64">
            <div className="text-7xl text-white font-bold">
              Start coding with the <span className="text-gray-400">Bros</span>{" "}
              Now!
            </div>
            <h1 className="text-white text-centre text-xl mt-7 w-3/5">
              Your coding community awaits! BroCode is your gateway to
              collaborative coding brilliance. Connect, create, and code with
              the bros
            </h1>
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;
