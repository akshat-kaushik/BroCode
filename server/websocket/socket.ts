import { Server } from "socket.io";
import jwt from "jsonwebtoken";

class SocketServer {
  private ws: Server;

  constructor() {
    this.ws = new Server({
      cors: {
        origin: "*",
        allowedHeaders: ["*"],
        credentials: true,
      },
    });
  }

  usersSocketMap = new Map<string, string[]>();

  auth(socket: any, next: any) {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      socket.request.user = decoded;
      next();
    } catch (err) {
      return next(new Error("Unauthorized"));
    }
  }

  getAllUsersInRoom(roomId: string) {
    return [...(this.ws.sockets.adapter.rooms.get(roomId) || [])].map(
      (socketId) => {
        return {
          socketId,
          username: this.usersSocketMap.get(socketId) || "",
        };
      }
    );
  }

  public initListeners() {
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

export { SocketServer };
