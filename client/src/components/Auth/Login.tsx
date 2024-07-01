import React, { useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import userContext, { ContextProps } from "../../contexts/userContext";

interface LoginData {
  email: string;
  password: string;
}

interface ResponseData {
  token: string;
  username: string;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setmUsername, setLoggedIn } = useContext(userContext) as ContextProps;

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    const loginData: LoginData = {
      email,
      password,
    };

    fetch("http://localhost:3000/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((res: Response) => {
        if (!res.ok) {
          toast.error("Invalid credentials");
          console.error("Error:", res);
          throw new Error("Invalid credentials");
          
        }
        return res.json();
      })
      .then((data: ResponseData) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        setLoggedIn(true);
        setmUsername(data.username);
        toast.success("Logged In Successfully");
      })
      .catch((error: Error) => {
        console.error("Error:", error);
        toast.error(error.message || "Failed to log in.");
      });
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="centre">
        <Toaster position="top-center" />
        <h1 className="text-5xl text-center -mt-20 mb-10">LOGIN</h1>
        <form onSubmit={handleLogin} className="">
          <div className="mb-5">
            <label>Email</label>
            <input
              type="text"
              placeholder="Enter Email"
              className="input input-bordered input-primary w-full max-w-xs"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="input input-bordered input-primary w-full max-w-xs"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn centre">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
