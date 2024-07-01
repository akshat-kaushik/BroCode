import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface IUserDocument extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  snippet: {};
}

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    snippet:{}
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(this.password, salt);
  this.password = hashedPassword;
  next();
});


const User = mongoose.model<IUserDocument>("User", UserSchema);

export default User;
