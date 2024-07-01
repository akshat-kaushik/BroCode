import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
    user: any;
}

const checkAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.header("token");
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Unauthorizeddd" });
    }
}

export default checkAuth;