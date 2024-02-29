"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
const socket_io_1 = require("socket.io");
class SocketServer {
    constructor() {
        this.usersSocketMap = new Map();
        this.ws = new socket_io_1.Server({
            cors: {
                origin: "*",
                allowedHeaders: ["*"],
            },
        });
    }
    getAllUsersInRoom(roomId) {
        return Array.from(this.ws.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
            return {
                socketId,
                name: this.usersSocketMap.get(socketId) || "",
            };
        });
    }
    initListeners() {
        this.ws.on("connection", (socket) => {
            console.log("a user connected", socket.id);
            socket.on("join", (data) => {
                console.log("Joining Room", data);
                this.usersSocketMap.set(socket.id, data.name);
                socket.join(data.roomId);
                const clients = this.getAllUsersInRoom(data.roomId);
                console.log("clients", clients);
            });
        });
    }
    get wss() {
        return this.ws;
    }
}
exports.SocketServer = SocketServer;
