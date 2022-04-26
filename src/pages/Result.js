// import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";

const Result = ({ logOut }) => {
  const [marks, setMarks] = useState(0);

  const [totalMarks, setTotalMarks] = useState(0);
  // const [user, setUser] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("timeRemaining") > 1) {
      navigate("/home");
      navigate(0);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      // const topic = "Java";
      const dept = localStorage.getItem("department");
      const urlQ = process.env.REACT_APP_POST_ROUTE + "/getresult";

      try {
        const res = await axios({
          method: "POST",
          url: urlQ,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "x-access-token": "Bearer " + token,
          },
          data: {
            user: user,
            department: dept,
          },
        });

        const marksFromDb = res.data.marks;
        const totalMarksFD = res.data.totalMarks;

        setMarks(marksFromDb);
        setTotalMarks(totalMarksFD);
      } catch (error) {
        console.log(error);
        logOut();
        return;
      }
    })();
  }, []);

  const handleLogOutBrowser = async () => {
    await updateClockToDb(0);
    await logOut();
    localStorage.removeItem("timeRemaining");
  };

  const updateClockToDb = async (userTimerInBrowser) => {
    try {
      const res = await axios({
        method: "POST",
        url: process.env.REACT_APP_POST_ROUTE + "/updatetimer",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          "x-access-token": "Bearer " + localStorage.getItem("token"),
        },
        data: {
          timeleft: userTimerInBrowser,
        },
      });
    } catch (error) {}
  };

  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
      }}
    >
      <div
        style={{
          margin: 0,
          position: "absolute",
          height: "50vh",
          width: "80vw",
          top: "50%",
          left: "50%",
          color: "#04AA6D",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h2>
          Congrats {localStorage.getItem("user")}! You've completed the exam.
        </h2>

        <h2>
          Your Score is {marks} out of {totalMarks}
        </h2>

        <Button
          variant="contained"
          color="success"
          onClick={handleLogOutBrowser}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Result;
