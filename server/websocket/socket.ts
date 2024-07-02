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
    return Array.from(this.ws.sockets.adapter.rooms.get(roomId) || []).map(
      (socketId) => {
        return {
          socketId,
          username: this.usersSocketMap.get(socketId) || "",
        };
      }
    );
  }

  public initListeners() {
    // this.ws.use((socket, next) => {
    //   this.auth(socket, next);
    // });

    this.ws.on("connection", (socket) => {
      console.log("a user connected", socket.id);

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
    });

    this.ws.on("code-change", (data) => {
      console.log("code-change", data);
      this.ws.in(data.roomId).emit("code-change", data.code);
    });

    this.ws.on("disconnecting", (socket) => {
      const rooms = Array.from(socket.rooms);
      rooms.forEach((room) => {
        socket.in(room).emit("disconnected", {
          socketId: socket.id,
          username: this.usersSocketMap.get(socket.id),
        });
      });
      this.usersSocketMap.delete(socket.id);
      socket.leave();
    });

    this.ws.on("code-sync", (data) => {
      console.log("code-sync", data);
      this.ws.to(data.socketId).emit("code-change", data.code);
    });
  }

  get wss() {
    return this.ws;
  }
}

export { SocketServer };
