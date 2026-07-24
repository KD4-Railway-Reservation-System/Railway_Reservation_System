import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handOnclick(e) {
    e.preventDefault();

    try {
      const res = await axios.post("url", {
        email: email,
        password: password,
      });

      if (res.data.success) {
        navigate("/");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Something went wrong");
    }
  }

  return (
  <div
    className="min-h-screen bg-cover bg-center flex items-center justify-center"
    style={{ backgroundImage: "url('/login_train.jpg')" }}
  >
    <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg">

      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Login
      </h1>

      <form onSubmit={handOnclick} className="space-y-5">

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>

      </form>

    </div>
  </div>
  );
}
