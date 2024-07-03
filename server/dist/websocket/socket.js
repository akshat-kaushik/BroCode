"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class SocketServer {
    constructor() {
        this.usersSocketMap = new Map();
        this.ws = new socket_io_1.Server({
            cors: {
                origin: "*",
                allowedHeaders: ["*"],
                credentials: true,
            },
        });
    }
    auth(socket, next) {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Unauthorized"));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
            socket.request.user = decoded;
            next();
        }
        catch (err) {
            return next(new Error("Unauthorized"));
        }
    }
    getAllUsersInRoom(roomId) {
        return [...(this.ws.sockets.adapter.rooms.get(roomId) || [])].map((socketId) => {
            return {
                socketId,
                username: this.usersSocketMap.get(socketId) || "",
            };
        });
    }
    initListeners() {
        this.ws.on("connection", (socket) => {
            console.log("A user connected", socket.id);
            socket.on("join", (data) => {
                console.log("Joining Room", data);
                this.usersSocketMap.set(socket.id, data.username);
                socket.join(data.roomId);
                const clients = this.getAllUsersInRoom(data.roomId);
                console.log("clients", clients);
                clients.forEach((client) => {
                    this.ws.to(client.socketId).emit("joined", {
                        clients,
                        socketId: socket.id,
                        username: data.username,
                    });
                });
            });
            socket.on("disconnecting", () => {
                const rooms = [...socket.rooms];
                rooms.forEach((room) => {
                    socket.in(room).emit("disconnected", {
                        socketId: socket.id,
                        username: this.usersSocketMap.get(socket.id),
                    });
                });
                this.usersSocketMap.delete(socket.id);
                rooms.forEach((room) => {
                    socket.leave(room);
                });
            });
            socket.on("code-change", (data) => {
                console.log("code-change received", data);
                socket.in(data.roomId).emit("code-change", data.code);
            });
            socket.on("code-sync", ({ code, socketId }) => {
                console.log("code-sync", code, socketId);
                this.ws.to(socketId).emit("code-sync", code);
            });
        });
    }
    get wss() {
        return this.ws;
    }
}
exports.SocketServer = SocketServer;
