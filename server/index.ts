import express, { Request, Response } from "express";
import http from "http";
import { SocketServer } from "./websocket/socket";

const app = express();
const server = http.createServer(app);
const port = 3000;

const socketServer = new SocketServer();

socketServer.wss.attach(server);
socketServer.initListeners();

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
