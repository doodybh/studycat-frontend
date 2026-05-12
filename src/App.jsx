import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import axios from "axios";
import "./App.css";

import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CreateCat from "./pages/CreateCat";

function App() {
  const [user, setUser] = useState(null);
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkCat(token) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/cat`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCat(response.data);
    } catch (err) {
      setCat(null);
    }
  }

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const userInfo = JSON.parse(atob(token.split(".")[1])).payload;
          setUser(userInfo);
          await checkCat(token);
        } catch (err) {
          console.error("Invalid token:", err);
          localStorage.removeItem("token");
          setUser(null);
          setCat(null);
        }
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <Navbar user={user} setUser={setUser} setCat={setCat} />

      <Routes>
        <Route path="/" element={<Homepage />} />

        <Route
          path="/sign-up"
          element={
            !user ? (
              <Signup />
            ) : (
              <Navigate to={cat ? "/dashboard" : "/create-cat"} />
            )
          }
        />

        <Route
          path="/sign-in"
          element={
            !user ? (
              <SignIn setUser={setUser} checkCat={checkCat} />
            ) : (
              <Navigate to={cat ? "/dashboard" : "/create-cat"} />
            )
          }
        />

        <Route
          path="/create-cat"
          element={
            user ? (
              cat ? (
                <Navigate to="/dashboard" />
              ) : (
                <CreateCat setCat={setCat} />
              )
            ) : (
              <Navigate to="/sign-in" />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              cat ? (
                <Dashboard user={user} cat={cat} />
              ) : (
                <Navigate to="/create-cat" />
              )
            ) : (
              <Navigate to="/sign-in" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
