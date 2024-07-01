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
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("signuphit");
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res
            .status(400)
            .json({ error: "Email , password and username are required" });
    }
    try {
        const existingUser = yield User_1.default.findOne({
            email,
        });
        if (existingUser)
            return res.status(400).json({ error: "User already exists" });
        const user = new User_1.default({ username, email, password });
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ user: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
        console.log("signed up");
        return res.status(200).json({
            message: "signed up",
            username: user.username,
            token: token,
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.default = signup;
