"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./websocket/socket");
const mongoose_1 = __importDefault(require("mongoose"));
const signup_1 = __importDefault(require("./auth/signup"));
const login_1 = __importDefault(require("./auth/login"));
require("dotenv").config();
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.post("/api/v1/signup", signup_1.default);
app.post("/api/v1/login", login_1.default);
const mongoUrl = process.env.MONGO_URI || "";
mongoose_1.default
    .connect(mongoUrl)
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
});
const socketServer = new socket_1.SocketServer();
socketServer.wss.attach(server);
socketServer.initListeners();
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
