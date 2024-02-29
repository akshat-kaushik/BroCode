"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./websocket/socket");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const port = 3000;
const socketServer = new socket_1.SocketServer();
socketServer.wss.attach(server);
socketServer.initListeners();
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
