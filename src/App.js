import "./App.css";

import Exam from "./pages/Exam";
import Result from "./pages/Result";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [user, setUser] = useState(localStorage.getItem("user"));
  // const [tokenApp, setTokenApp] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const tokenStored = localStorage.getItem("token");
    const userStored = localStorage.getItem("user");
    setUser(userStored);
    // setTokenApp(tokenStored);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const intervalId = setInterval(updateClockToDb, 5000);

      return () => clearInterval(intervalId); //This is important
    }
  }, []);

  const updateClockToDb = async () => {
    const timeStoredOnMachine = localStorage.getItem("timeRemaining");
    try {
      if (timeStoredOnMachine) {
        const res = await axios({
          method: "POST",
          url: process.env.REACT_APP_POST_ROUTE + "/updatetimer",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "x-access-token": "Bearer " + localStorage.getItem("token"),
          },
          data: {
            timeleft: timeStoredOnMachine,
          },
        });
      }
    } catch (error) {
      handleLogOut();
    }
  };

  //function for auth
  const handleAuth = (creds) => {
    setUser(creds.user);
    // setTokenApp(creds.token);
    navigate("home");
  };

  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("totalTime");

    navigate(0);
  };

  return (
    <div className="App">
      <Routes>
        {user && (
          <>
            <Route path="exam" element={<Exam logOut={handleLogOut} />} />
            <Route path="home" element={<Home logOut={handleLogOut} />} />
            <Route path="result" element={<Result logOut={handleLogOut} />} />
          </>
        )}
        {!user && (
          <Route
            path="login"
            element={<Login handleAuth={handleAuth} logOut={handleLogOut} />}
          />
        )}

        <Route path="*" element={<Navigate to={user ? "home" : "login"} />} />
      </Routes>
    </div>
  );
}

export default App;
