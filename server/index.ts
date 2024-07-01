import express, { Request, Response } from "express";
import http from "http";
import { SocketServer } from "./websocket/socket";
import mongoose from "mongoose";
import signup from "./auth/signup"; 
import login from "./auth/login";
require("dotenv").config();
import cors from "cors";



const app = express();
app.use(cors());
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/api/v1/signup", signup);
app.post("/api/v1/login", login);



const mongoUrl = process.env.MONGO_URI || "";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

  

const socketServer = new SocketServer();



socketServer.wss.attach(server);
socketServer.initListeners();

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
