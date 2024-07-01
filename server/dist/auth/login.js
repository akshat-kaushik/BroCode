"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log("login hit");
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ error: "User does not exist" });
        const valid = bcrypt_1.default.compareSync(password, user.password);
        if (!valid)
            return res.status(400).json({ error: "Invalid password" });
        const token = jsonwebtoken_1.default.sign({ user: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
        return res.status(200).json({ message: "Logged in", username: user.username, token: token });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.default = login;
