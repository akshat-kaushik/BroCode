import { useContext, useEffect, useRef, useState } from "react";
import { initUserSocket } from "../../sockets/userSocket";
import { Socket } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../../contexts/userContext";
import Editor from "./Editor";
import TerminalComponent from "./Terminal";

function CodeEditor() {
  const { musername } = useContext(UserContext) || {};
  console.log(musername);

  const [users,setUsers]=useState([{name:"user1",socketid:"1"},{name:"user2",socketid:"2"}])
  const socketRef = useRef<Socket | null>(null);
  const codeRef = useRef<string | null>(null);
  const reactNavigator = useNavigate();
  const roomId = useParams().roomId;

  const handleErrors = (err: any) => {
    console.log("error", err);
    toast.error("Error in connection");
    reactNavigator("/");
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initUserSocket();
      console.log("connecting");
      socketRef.current?.on("connect_error", (err: any) => {
        handleErrors(err);
      });
      socketRef.current?.on("connect_failed", (err: any) => {
        handleErrors(err);
      });
      console.log("connected");

      socketRef.current.emit("join", {
        roomId: roomId,
        username: musername,
      });

      socketRef.current.on("joined", ({ clients, username,socketId }) => {
        if (username != musername) {
          toast.success(`${username} joined`);
        }
        clients.map((name: string) => {
          if (name == musername) clients.pop(name);
        });
        setClients(clients);
        console.log("clients", clients);
        
        socketRef.current?.emit("code-sync", {
          code: codeRef.current,
          socketId: socketId,
        })
        console.log("Code Synced");
      });

      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.error(`${username} left the room`);
        setClients((prev)=>{
          return prev.filter((client)=>client.socketId!==socketId)
        });
      })
      
    };
    init();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off("joined").disconnect()
      socketRef.current?.off("disconnected").disconnect();
    };
  }, []);


  type Client = {
    socketId: string;
    username: string;
  };

  const [clients, setClients] = useState<Client[]>([]);

  return (
    <div className="flex h-screen">
      <Toaster/>
      {/* Left Side */}
      <div className="drawer ml-4 absolute z-10">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
            |||
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <div className="flex-col justify-between bottom-0">
              <button className="btn mr-2 btn-primary">COPY ROOM ID</button>
              <button onClick={()=>{reactNavigator("/")}} className="btn btn-primary">LEAVE ROOM</button>
            </div>
            <div className="text-lg">
              <h1 className="text-lg mt-10">JOINED USERS</h1>
              {clients.map((user) => {
                return <li>{user.username}</li>;
              })}
            </div>
          </ul>
        </div>
      </div>
      <div className="w-2/3 h-full flex flex-col">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          codeChange={(code: string) => {
            codeRef.current = code;
            console.log("Code changed sync", code);
          }}
        />

        <div className="h-1/4 border p-4 mt-4">
          <div className="text-lg font-bold mb-2"><TerminalComponent/></div>
          termunakl
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/3 h-full border">
        <div className="text-lg font-bold p-4">Video Call Window</div>
        {/* Video call content here */}
        <div className="h-full flex justify-center items-center">
          {/* Video call component or placeholder */}
          <div className="text-xl">Video Call Placeholder</div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
