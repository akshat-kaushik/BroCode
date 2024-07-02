import { io } from "socket.io-client";

export const initUserSocket = async () => {
  const backendUrl = "http://localhost:3000";
  const socket = io(backendUrl, {
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
