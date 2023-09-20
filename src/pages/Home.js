import { Button } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("timeRemaining") <= 1) {
      navigate("/result");
      navigate(0);
    }
  }, []);

  const startExam = () => {
    navigate("/exam");
    navigate(0);
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
          width: "70vw",
          top: "50%",
          left: "50%",
          color: "#04AA6D",
          transform: "translate(-50%, -50%)",
          border: "2px solid #04AA6D",
          padding: "5rem",
        }}
      >
        <h2>Welcome to our Exam Portal</h2>

        <h4>To start your Exam , click on the button below</h4>
        <div style={{ marginTop: "8rem" }}>
          <Button variant="contained" color="success" onClick={startExam}>
            Start Exam
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
