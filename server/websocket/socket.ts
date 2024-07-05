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

  usersSocketMap = new Map<string, string>();

  // auth(socket: any, next: any) {
  //   const token = socket.handshake.auth.token;

  //   if (!token) {
  //     return next(new Error("Unauthorized"));
  //   }

  //   try {
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
  //     socket.request.user = decoded;
  //     next();
  //   } catch (err) {
  //     return next(new Error("Unauthorized"));
  //   }
  // }

  
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
      socket.on("join", (data) => {
        this.usersSocketMap.set(socket.id, data.username);
        socket.join(data.roomId);
        const clients = this.getAllUsersInRoom(data.roomId);

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
        socket.in(data.roomId).emit("code-change", data.code);
      });

      socket.on("offer", (data) => {
        socket.to(data.roomId).emit("offer", data.offer);
      });

      socket.on("answer", (data) => {
        socket.to(data.roomId).emit("answer", data.answer);
      });

      socket.on("ice-candidate", (data) => {
        socket.to(data.roomId).emit("ice-candidate", data.candidate);
      });
    });
  }

  get wss() {
    return this.ws;
  }
}

export { SocketServer };
