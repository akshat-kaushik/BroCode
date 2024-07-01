"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    snippet: {}
}, {
    timestamps: true,
});
UserSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = bcrypt_1.default.genSaltSync(10);
    const hashedPassword = bcrypt_1.default.hashSync(this.password, salt);
    this.password = hashedPassword;
    next();
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
