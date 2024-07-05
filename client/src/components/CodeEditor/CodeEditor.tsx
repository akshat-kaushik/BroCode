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
  const socketRef = useRef<Socket | null>(null);
  const codeRef = useRef<string | null>(null);
  const reactNavigator = useNavigate();
  const roomId = useParams().roomId;
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [pc, setPc] = useState<RTCPeerConnection | null>(null);

  const handleErrors = (err: any) => {
    toast.error("Error in connection",err);
    reactNavigator("/");
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initUserSocket();
      socketRef.current.on("connect_error", handleErrors);
      socketRef.current.on("connect_failed", handleErrors);

      socketRef.current.emit("join", {
        type: "code",
        roomId: roomId,
        username: musername,
      });

      socketRef.current.on("joined", ({ clients, username, socketId }) => {
        if (username !== musername) {
          toast.success(`${username} joined`);
        }
        setClients(clients.filter((client) => client.username !== musername));

        socketRef.current?.emit("code-sync", {
          code: codeRef.current,
          socketId: socketId,
        });
      });

      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.error(`${username} left the room`);
        setClients((prev) => prev.filter((client) => client.socketId !== socketId));
      });

      const pc = new RTCPeerConnection();
      setPc(pc);

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socketRef.current?.emit("ice-candidate", {
            candidate: e.candidate,
            roomId: roomId,
          });
        }
      };

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      // stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      // if (videoRef.current) {
      //   videoRef.current.srcObject = stream;
      // }

      pc.onnegotiationneeded = async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current?.emit("offer", {
          offer: offer,
          roomId: roomId,
        });
      };

      socketRef.current.on("offer", async (offer: RTCSessionDescriptionInit) => {
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketRef.current?.emit("answer", {
          answer: answer,
          roomId: roomId,
        });
      });

      socketRef.current.on("answer", async (answer: RTCSessionDescriptionInit) => {
        await pc.setRemoteDescription(answer);
      });

      socketRef.current.on("ice-candidate", async (candidate) => {
        await pc.addIceCandidate(candidate);
      });

    };


    init();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off("joined").disconnect();
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
      <Toaster />
      <div className="drawer ml-4 absolute z-10">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="btn btn-primary drawer-button">|||</label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <div className="flex-col justify-between bottom-0">
              <button className="btn mr-2 btn-primary">COPY ROOM ID</button>
              <button onClick={() => reactNavigator("/")} className="btn btn-primary">LEAVE ROOM</button>
            </div>
            <div className="text-lg">
              <h1 className="text-lg mt-10">JOINED USERS</h1>
              {clients.map((user) => <li key={user.socketId}>{user.username}</li>)}
            </div>
          </ul>
        </div>
      </div>
      <div className="w-2/3 h-full flex flex-col">
        <Editor socketRef={socketRef} roomId={roomId} codeChange={(code) => { codeRef.current = code; }} />
        <div className="h-1/4 border p-4 mt-4">
          <div className="text-lg font-bold mb-2">
            <TerminalComponent />
          </div>
        </div>
      </div>
      <div className="w-1/3 h-full border">
        <div className="text-lg font-bold p-4">Video Call Window</div>
        <div className="h-full flex flex-col justify-center items-center">
          <video ref={videoRef} autoPlay playsInline muted className="w-1/2 mb-4"></video>
          <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2"></video>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
