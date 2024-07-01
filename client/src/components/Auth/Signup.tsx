import { useState, MouseEvent } from "react";
import { useContext } from "react";
import userContext from "../../contexts/userContext";
import { ContextProps } from "../../contexts/userContext";
import toast, { Toaster } from "react-hot-toast";

interface User {
  username: string;
  email: string;
  password: string;
}

interface ResponseData {
  token: string;
  username: string;
}

function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { setmUsername, setLoggedIn } = useContext(userContext) as ContextProps;

  function handleSignUp(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("Username, email, and password are required.");
      return;
    }

    const user: User = {
      username,
      email,
      password,
    };

    fetch("http://localhost:3000/api/v1/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Email already exists,Please try with another email.");
        }
        return res.json();
      })
      .then((data: ResponseData) => {
        console.log(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        setLoggedIn(true);
        setmUsername(data.username);
        toast.success("Signed Up Successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(error.message || "Failed to sign up.");
      });
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="centre">
        <Toaster position="top-center" />
        <h1 className="text-5xl text-center -mt-20 mb-5">SIGNUP</h1>
        <form className="">
          <div className="mb-5">
            <label className="">Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              className="input input-bordered input-primary w-full max-w-xs"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setmUsername(e.target.value);
              }}
            />
          </div>
          <div className="mb-5">
            <label className="">Email</label>
            <input
              type="text"
              placeholder="Enter Email"
              className="input input-bordered input-primary w-full max-w-xs"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="mb-5">
            <label className="">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="input input-bordered input-primary w-full max-w-xs"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <button onClick={handleSignUp} className="btn">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
