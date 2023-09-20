import Question from "../components/Question";
import Instruction from "../components/Instruction";
import Clock from "../components/Clock";
import Pagination from "@mui/material/Pagination";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Chip } from "@mui/material";

const ExamPage = ({ logOut }) => {
  const [cq, setCQ] = useState(1);
  const [data, setData] = useState();
  const [answers, setAnswers] = useState(null);

  const navigate = useNavigate();

  const [timeRemaining, setTimeRemaining] = useState(
    localStorage.getItem("timeRemaining")
  );
  const [totalTimeExam, setTotalTimeExam] = useState(
    localStorage.getItem("totalTime")
  );

  useEffect(() => {
    if (localStorage.getItem("timeRemaining") <= 1) {
      navigate("/result");
      navigate(0);
    }
  });

  //get question on load
  useEffect(() => {
    (async () => {
      const timeStored = localStorage.getItem("timeRemaining");
      const totalTimeStored = localStorage.getItem("totalTime");
      const set = localStorage.getItem("set");
      setTimeRemaining(timeStored);
      setTotalTimeExam(totalTimeStored);

      const topic = "Java";
      const department = localStorage.getItem("department");
      const urlQ =
        "http://localhost:8081/get" +
        "/questions/" +
        topic +
        "/" +
        department +
        "/" +
        set;

      try {
        const res = await axios({
          method: "GET",
          url: urlQ,
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "x-access-token": "Bearer " + localStorage.getItem("token"),
          },
        });

        // console.log(res.data);
        setData(res.data);

        // const topic = "Java";
        // const urlQ = "http://localhost:8081/get" + "/answers";

        const rest = await axios({
          method: "GET",
          url: "http://localhost:8081/get" + "/answers",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "x-access-token": "Bearer " + localStorage.getItem("token"),
          },
        });

        // console.log(res.data);
        setAnswers(rest.data);
      } catch (err) {
        console.log(err);
        logOut();
      }
    })();
  }, []);

  //get saved answers on load
  // useEffect(() => {
  //   (async () => {
  //     const token = localStorage.getItem("token");

  //     // const topic = "Java";
  //     const urlQ = process.env.REACT_APP_GET_ROUTE + "/answers";

  //     try {
  //       const res = await axios({
  //         method: "GET",
  //         url: urlQ,
  //         headers: {
  //           "Content-Type": "application/json;charset=UTF-8",
  //           "Access-Control-Allow-Origin": "*",
  //           "x-access-token": "Bearer " + token,
  //         },
  //       });

  //       // console.log(res.data);
  //       setAnswers(res.data);
  //     } catch (error) {
  //       console.log(error);
  //       logOut();
  //     }
  //   })();
  // }, []);

  //update answers on answer submit
  const updateAnswersToDb = async (answerArray) => {
    const topic = "Java";
    const urlQ = process.env.REACT_APP_POST_ROUTE + "/updateanswer";

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
          topic: topic,
          answers: answerArray,
        },
      });
    } catch (err) {
      console.log(err);
      logOut();
    }
  };

  const handleQuestionChange = (event, value) => {
    setCQ(value);
  };

  // console.log(timeRemaining);
  const skipQuestion = () => {
    if (cq >= data.length) {
      setCQ(1);
    } else setCQ(cq + 1);
  };

  const quitExam = () => {
    localStorage.setItem("timeRemaining", 0);
    navigate("/result");

    //after chanigng route , to refresh page automatically
    navigate(0);
  };

  const updateAnswers = async (opt) => {
    skipQuestion();
    const _answerObject = answers;

    _answerObject[data[cq - 1].qno] = opt;

    // console.log(_answerObject, opt, data[cq - 1].qno, data[cq - 1]);
    await updateAnswersToDb(_answerObject);

    setAnswers(_answerObject);
  };

  const instructionList = [
    "There is no negative marking.",
    "Donot open new tab or window during exam",
    " All question consists of 1 marks",
    "Total time provided is " + localStorage.getItem("totalTime") + " minutes",
  ];

  return (
    <div>
      <Grid container spacing={1} justifyContent="space-between">
        <Grid
          item
          md={3}
          sx={{ display: { xs: "none", sm: "none", md: "block", lg: "block" } }}
        >
          <Box
            sx={{
              height: "100vh",
              backgroundColor: "#DFF6E2",
              overflowY: "scroll",
            }}
          >
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              py={3}
            >
              <Grid item>
                <Chip
                  label={"UserId:-  " + localStorage.getItem("user")}
                  color="success"
                  variant="outlined"
                />
              </Grid>

              <Grid item style={{ marginTop: "1rem" }}>
                {" "}
                <Chip
                  label={"UserName:-  " + localStorage.getItem("applicantName")}
                  color="success"
                  variant="outlined"
                />
              </Grid>

              <Grid item>
                {" "}
                <Clock
                  totalTime={totalTimeExam * 60 * 1000}
                  timeRemaining={timeRemaining * 1000}
                />
              </Grid>
              <Grid item>
                {" "}
                <Instruction instructions={instructionList} />
              </Grid>

              <Button variant="contained" color="error" onClick={quitExam}>
                Quit Exam
              </Button>
            </Grid>
          </Box>
        </Grid>
        {data && data.length && (
          <Grid item md={9}>
            {" "}
            <Box
              sx={{
                height: "100vh",
                backgroundColor: "#DFF6E2",
                overflowY: "scroll",
              }}
            >
              <Grid container justifyContent="center" p={3}>
                <Pagination
                  count={data.length}
                  page={cq}
                  variant="outlined"
                  shape="rounded"
                  color="primary"
                  onChange={handleQuestionChange}
                />
              </Grid>

              {answers && (
                <Question
                  curQuestion={data[cq - 1]}
                  handleUpdateAnswer={updateAnswers}
                  skipQNo={skipQuestion}
                  answer={answers[data[cq - 1].qno] || ""}
                />
              )}
            </Box>
          </Grid>
        )}
      </Grid>

      {/* <div className="examLeftPanel">
        <Question />
      </div>
      <div className="examRightPanel">
      </div> */}
    </div>
  );
};

export default ExamPage;
