import React from "react";
import Router from "./Routes/Router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div>
      <Navbar />
      <Router></Router>
      <Footer />
    </div>
  );
}
