import * as React from "react";
import Grid from "@mui/material/Grid";
import EducationBox from "./educationBox";
import AboutMeBox from "./aboutMeBox";
import ExpBox from "./expBox";
import SkillsetBox from "./skillsetBox";
import ContactBox from "./contactBox";
import QuestionsBox from "./questionsBox";

const BoxGridder = () => {
  return (
    <React.Fragment>
      <Grid container spacing={5}>
        <Grid item xs={8}>
          <AboutMeBox />
        </Grid>
        <Grid item xs={3}>
          <div></div>
        </Grid>
        <Grid item xs={4}>
          <div></div>
        </Grid>
        <Grid item xs={8}>
          <EducationBox />
        </Grid>
        <Grid item xs={8}>
          <ExpBox />
        </Grid>
        <Grid item xs={4}>
          <div></div>
        </Grid>
        <Grid item xs={4}>
          <div></div>
        </Grid>
        <Grid item xs={8}>
          <SkillsetBox />
        </Grid>
        <Grid item xs={8}>
          <ContactBox />
        </Grid>
        <Grid item xs={4}>
          <div></div>
        </Grid>
        <Grid item xs={12}>
          <QuestionsBox />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default BoxGridder;
