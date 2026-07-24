import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-zinc-700">
      <button onClick={() => navigate("/")}>Home</button>
      <button onClick={() => navigate("/about")}>About</button>
      <button onClick={() => navigate("/services")}>Services</button>
      <button onClick={() => navigate("/projects")}>Projects</button>
      <button onClick={() => navigate("/contact")}>Contact</button>
      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  );
}
