import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
const imagesDir = require.context("../exam_assets/images/", true);

const Question = ({ curQuestion, skipQNo, handleUpdateAnswer, answer }) => {
  const answerOption = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // console.log(answer);

  useEffect(() => {
    setSelectedIndex(answerOption.indexOf(answer));
    setSelectedOption(answer);
  }, [answer, curQuestion.qno]);

  const changeSelect = (e) => {
    const _index = e.target.value;
    const selectedOption = answerOption[_index];

    // console.log(selectedOption);

    setSelectedIndex(_index);
    setSelectedOption(selectedOption);
  };

  const clearOption = () => {
    setSelectedIndex(-1);
    setSelectedOption("");
  };

  // const skipQuestion = () => {
  //   skipQNo();
  // };

  const handleAnswerSubmit = () => {
    handleUpdateAnswer(selectedOption);
    setSelectedOption("");
    setSelectedIndex(-1);
  };

  return (
    <div align="left">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            component="div"
            align="left"
            gutterBottom
            px={5}
          >
            Topic:- {curQuestion.qtopic}
          </Typography>

          <Typography
            variant="subtitle1"
            component="div"
            align="left"
            gutterBottom
            px={5}
          >
            Question No:- {curQuestion.SetQNo}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            align="left"
            gutterBottom
            px={5}
            py={2}
          >
            {curQuestion.question}
          </Typography>
          {curQuestion["question_image"] && (
            <img
              className="question_asn_image"
              src={imagesDir(`./${curQuestion["question_image"]}`)}
              width="600"
              alt={curQuestion["qno"]}
              height="250"
            ></img>
          )}
        </Grid>
        <Grid item xs={12}>
          <FormControl sx={{ padding: 5 }}>
            <FormLabel id="demo-radio-buttons-group-label">
              Selected Option: {selectedOption}
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue=""
              name="radio-buttons-group"
              value={selectedIndex}
              onChange={changeSelect}
            >
              {[
                { option: "option_a", image: "option_a_image" },
                { option: "option_b", image: "option_b_image" },
                { option: "option_c", image: "option_c_image" },
                { option: "option_d", image: "option_d_image" },
                { option: "option_e", image: "option_e_image" },
                { option: "option_f", image: "option_f_image" },
              ].map((item, index) => {
                const { option, image } = item;

                const imgSrc = curQuestion[image];
                const optionLabel = curQuestion[option];

                // console.log(imgSrc + " actual");
                // console.log("../exam_assets/images/azarul.jpg" + " test");
                return (
                  <>
                    {imgSrc && (
                      <img
                        key={index}
                        src={imagesDir(`./${imgSrc}`)}
                        alt={imgSrc}
                        width="400"
                        height="200"
                      ></img>
                    )}
                    {optionLabel && (
                      <FormControlLabel
                        key={index}
                        sx={{ marginTop: "1.5rem" }}
                        value={index}
                        control={<Radio />}
                        label={optionLabel}
                        // onChange={() => changeSelect}
                      />
                    )}
                  </>
                );
              })}
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            sx={{ paddingX: 5, paddingBottom: 5 }}
          >
            <Grid item md={4} xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  md={6}
                  xs={12}
                  sx={{ display: selectedOption ? "inline" : "none" }}
                >
                  <Button onClick={clearOption} variant="contained" fullWidth>
                    Clear
                  </Button>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleAnswerSubmit}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={2} xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button onClick={skipQNo} variant="contained" fullWidth>
                    Skip
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Question;
