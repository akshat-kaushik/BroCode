
import React, { useState } from 'react';

function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="centre">
        <h1 className="text-5xl text-center mb-10">LOGIN</h1>
        <form className="">
          <div className="">
            <label className="">Email</label>
            <input type="email" placeholder="Enter Email" className="input input-bordered input-primary w-full max-w-xs" />
          </div>
          <div className="">
            <label className="">Password</label>
            <input type="password" placeholder="Enter Password" className="input input-bordered input-primary w-full max-w-xs" />
          </div>
          <button className="btn centre">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
