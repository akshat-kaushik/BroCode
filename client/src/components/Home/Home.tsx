import { useContext, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import UserContext from "../../contexts/userContext";
import SignUp from "../Auth/Signup";
import Login from "../Auth/Login";

function Home() {
  const navigate = useNavigate();
  const { musername, loggedIn, setLoggedIn, setmUsername, setLanguage } =
    useContext(UserContext)!;

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      console.log("Logged In");
      setLoggedIn!(true);
      setmUsername!(localStorage.getItem("username") || "");
    }
  }, [setLoggedIn, setmUsername]);

  const handleCreateRoom = () => {
    const roomId = v4();
    console.log("Create Room");
    toast.success("Room Created");
    navigate(`/codeEditor/${roomId}`);

    navigator.clipboard.writeText(roomId).then(
      function () {
        toast.success("Room ID Copied");
        console.log("Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const joinRoom = () => {
    console.log("Join Room");
    const roomId = (document.querySelector("input") as HTMLInputElement).value;
    navigate(`/codeEditor/${roomId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      joinRoom();
    }
  };

  return (
    <>
      <div className="w-screen h-screen bg-zinc-900 overflow-hidden">
        <header>
          <nav className="flex justify-between items-center h-16 bg-zinc-900 text-white">
            <div className="pl-8 text-4xl mt-10">BroCode</div>
            <div className="pr-8 mt-10">
              {loggedIn ? (
                <>
                  <div className="dropdown dropdown-hover mr-8">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-accent m-1"
                    >
                      Create Room
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                    >
                      <li
                        onClick={() => {
                          setLanguage!("javascript");
                          handleCreateRoom();
                        }}
                      >
                        <a>JavaScript</a>
                      </li>
                      <li
                        onClick={() => {
                          setLanguage!("python");
                          handleCreateRoom();
                        }}
                      >
                        <a>Python</a>
                      </li>
                      <li
                        onClick={() => {
                          setLanguage!("golang");
                          handleCreateRoom();
                        }}
                      >
                        <a>Golang</a>
                      </li>
                    </ul>
                  </div>
                  <Toaster position="top-right" />
                  <button
                    className="btn -ml-5"
                    onClick={() =>
                      (
                        document.getElementById(
                          "my_modal_2"
                        ) as HTMLDialogElement
                      ).showModal()
                    }
                  >
                    Join room
                  </button>
                  <dialog id="my_modal_2" className="modal">
                    <div className="modal-box">
                      <input
                        type="text"
                        placeholder="enter room id"
                        className="input input-bordered w-full max-w-xs"
                        onKeyDown={handleKeyDown}
                      />
                      <button onClick={joinRoom} className="btn ml-10">
                        Join
                      </button>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
                  <div className="dropdown dropdown-hover mr-8">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-ghost btn-accent m-1"
                    >
                      {musername}
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <a
                          onClick={() => {
                            setLoggedIn!(false);
                            setmUsername!("");
                            localStorage.clear();
                            toast.success("logged out");
                          }}
                        >
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <button
                    className="btn mr-4"
                    onClick={() =>
                      (
                        document.getElementById(
                          "my_modal_2"
                        ) as HTMLDialogElement
                      ).showModal()
                    }
                  >
                    SIGNUP
                  </button>
                  <dialog id="my_modal_2" className="modal">
                    <div className="modal-box overflow-hidden">
                      <SignUp />
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
                  <button
                    className="btn btn-outline mr-4"
                    onClick={() =>
                      (
                        document.getElementById(
                          "my_modal_3"
                        ) as HTMLDialogElement
                      ).showModal()
                    }
                  >
                    LOGIN
                  </button>
                  <dialog id="my_modal_3" className="modal">
                    <div className="modal-box overflow-hidden">
                      <Login />
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
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
              the bros.
            </h1>
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;
