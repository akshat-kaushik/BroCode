import { io } from "socket.io-client";

export const initUserSocket = async () => {
  
  const socket = io("http://localhost:3000", {
    forceNew: true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
    auth: {
      token: localStorage.getItem("token"),
    },
  });

  console.log("connecting to server");
  return socket;
};
