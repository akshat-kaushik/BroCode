import { Server } from "socket.io";

class SocketServer {
  private ws: Server;
  constructor() {
    this.ws = new Server({
      cors: {
        origin: "*",
        allowedHeaders: ["*"],
      },
    });
  }

  usersSocketMap = new Map<string, string[]>();

  getAllUsersInRoom(roomId: string) {
    return Array.from(
      (this.ws.sockets.adapter.rooms.get(roomId) as Set<any>) || []
    ).map((socketId) => {
      return {
        socketId,
        username: this.usersSocketMap.get(socketId) || "",
      };
    });
  }

  public initListeners() {
    this.ws.on("connection", (socket) => {
      console.log("a user connected", socket.id);
      socket.on("join", (data) => {
        console.log("Joining Room", data);
        this.usersSocketMap.set(socket.id, data.name);
        socket.join(data.roomId);
        const clients = this.getAllUsersInRoom(data.roomId);
        console.log("clients", clients);
        clients.forEach((client) => {
          this.ws.to(client.socketId).emit("joined", {
            clients,
            socketId: socket.id,
            username: data.name,
          });
        });
      });
    });
  }

  get wss() {
    return this.ws;
  }
}

export { SocketServer };
