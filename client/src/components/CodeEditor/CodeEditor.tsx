import { useContext, useEffect, useRef, useState } from "react";
import { initUserSocket } from "../../sockets/userSocket";
import { Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../../contexts/userContext";

function CodeEditor() {
  const {musername}=useContext(UserContext) || {};
  console.log(musername)
  console.log
  
  const socketRef = useRef<Socket | null>(null);
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

      socketRef.current.on("joined",({clients,username})=>{
        if(username!=musername){
          toast.success(`${username} joined`)
        }
        clients.map((name:string)=>{
          if(name==musername) clients.pop(name)
        })
        setClients(clients);


      })
     };

    init();
  }, []);

  type Client = {
    socketId: string;
    name: string;
  };

  const [clients, setClients] = useState<Client[]>([

  ]);

  return (
    <div className="">
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
            Open drawer
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <h1 className="text-2xl mb-4">Joined Coders</h1>
            

            <li>
              <a>coder1</a>
            </li>
            <li>
              <a>coder2</a>
            </li>

            <div className="">
              <button className="btn text-xl">Copy room ID</button>
              <button className="btn text-xl">Leave Room</button>
            </div>
          </ul>
        </div>
      </div>

      <div className="flex-grow">{/* <Editor></Editor> */}</div>
    </div>
  );
}

export default CodeEditor;
