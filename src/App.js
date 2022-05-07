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
  const [applicantName, setApplicantName] = useState(
    localStorage.getItem("applicantName")
  );
  // const [tokenApp, setTokenApp] = useState("");

  const navigate = useNavigate();

  const onVisibilityChange = async () => {
    if (document.visibilityState !== "visible") {
      alert(
        "Browser or tab switch detected, Please don't switch or open new tab"
      );

      const urlQ = process.env.REACT_APP_POST_ROUTE + "/detectuseractivity";

      try {
        await axios({
          method: "POST",
          url: urlQ,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "x-access-token": "Bearer " + localStorage.getItem("token"),
          },
          data: {
            userId: localStorage.getItem("user"),
            userName: localStorage.getItem("applicantName"),
          },
        });
      } catch (err) {
        // console.log(err);
        handleLogOut();
      }

      // console.log("tab closed or switched");
    }
  };

  useEffect(() => {
    // const tokenStored = localStorage.getItem("token");
    const userStored = localStorage.getItem("user");
    const applicantNameStored = localStorage.getItem("applicantName");
    setUser(userStored);
    setApplicantName(applicantNameStored);
    // setTokenApp(tokenStored);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const intervalId = setInterval(updateClockToDb, 5000);

      return () => clearInterval(intervalId); //This is important
    }
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const updateClockToDb = async () => {
    const timeStoredOnMachine = localStorage.getItem("timeRemaining");
    try {
      if (timeStoredOnMachine) {
        await axios({
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
    setApplicantName(creds.applicantName);
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
