import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import bcrypt from "bcrypt";


const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("login hit");
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User does not exist" });
        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) return res.status(400).json({ error: "Invalid password" });
        const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
        return res.status(200).json({ message: "Logged in", username: user.username, token: token });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};

export default login;