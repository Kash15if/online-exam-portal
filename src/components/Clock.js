import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import useCountDown from "react-countdown-hook";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Clock = ({ totalTime, timeRemaining }) => {
  //   const totalTime = 1000 * 60;
  //   const timeArray = totalTime.split(":");
  //   const totalHour = parseInt(timeArray[0]);
  //   const totalMin = parseInt(timeArray[1]);
  //   const totalSec = parseInt(timeArray[2]);

  //   const valueCP =
  //     ((totalHour * 60 + totalMin) / (2 * (totalHour * 60 + totalMin))) * 100;

  //   console.log(valueCP);

  const [timeLeft, actions] = useCountDown(timeRemaining, 1000);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [valueCP, setValueCP] = useState(100);
  const [clockColor, setClockColor] = useState("secondary");

  //   const valueCP = (timeLeft / totalTime) * 100;

  const navigate = useNavigate();
  useEffect(() => {
    actions.start();
  }, []);

  useEffect(() => {
    const valueCPIn = (timeLeft / totalTime) * 100;

    const timeInSec = timeLeft / 1000;
    const hoursIn = Math.floor(timeInSec / 3600);
    const minutesIn = Math.floor((timeInSec - hoursIn * 3600) / 60);
    const secondsIN = timeInSec - hoursIn * 3600 - minutesIn * 60;

    setValueCP(valueCPIn);
    setHours(hoursIn);
    setMinutes(minutesIn);
    setSeconds(secondsIN);

    if (timeInSec != 0 && timeInSec % 5 === 0) {
      // console.log(timeInSec);
      localStorage.setItem("timeRemaining", timeInSec);
    }

    if (timeInSec <= 120 && timeInSec != 0) {
      setClockColor("error");
    }

    if (timeInSec == 1) {
      updateClockToDb(timeInSec);
    }

    if (timeInSec == 1) {
      localStorage.setItem("timeRemaining", timeInSec);
      navigate(0);
    }
  }, [timeLeft]);

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
    <Box sx={{ position: "relative", display: "inline-flex", padding: "2rem" }}>
      <CircularProgress
        color={clockColor}
        variant="determinate"
        value={valueCP}
        size={140}
        thickness={4.5}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" component="div" color={clockColor}>
          {hours < 10 ? "0" + hours : hours} :
          {minutes < 10 ? "0" + minutes : minutes} :
          {seconds < 10 ? "0" + seconds : seconds}
        </Typography>
      </Box>
    </Box>
  );
};

export default Clock;
