import User from "../models/User";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const signup = async (req: Request, res: Response) => {
  console.log("signuphit");
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Email , password and username are required" });
  }
  try {
    const existingUser = await User.findOne({
      email,
    });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const user = new User({ username, email, password });
    await user.save();
    const token = jwt.sign(
      { user: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );
    console.log("signed up");
    return res.status(200).json({
      message: "signed up",
      username: user.username,
      token: token,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export default signup;
