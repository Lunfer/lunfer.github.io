import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "aos/dist/aos.css";

const SkillsetBox = () => {
  return (
    <React.Fragment>
      <Box
        id="skillsBox"
        data-aos="fade-left"
        data-aos-anchor="#expBox"
        data-aos-anchor-placement="center-center"
        sx={{
          background: "rgba(255, 255, 255, 0.4)",
          border: "none",
          borderRadius: "40px",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Typography variant="h5" sx={{ borderBottom: "1px solid" }}>
          Skillset
        </Typography>
        <Typography variant="subtitle1">
          So far I have successfully completed more than 30 different online
          courses in different learning platforms, with topics varying from Data
          Science, and Machine Learning to Management and Front-end web
          developing. {<br />} On the &quot;Top Skills&quot; list, Machine
          Learning takes up the first place and Front-end developing takes
          second. Up until this point, I have enough experience to deliver data
          visualization reports on top of projects that use machine learning
          algorithms to come up with certain conclusions and at the same time, I
          am capable of producing responsive websites like this one. {<br />}I
          am characterized by my strong sense of ownership and accountability,
          while also aspiring to further hone my management and leadership
          skills. {<br />} Having a passion for art means that I am a good
          painter, while always keeping an eye on details.{<br />} Finally,
          I&apos;m on an A1 level (at least) on multiple foreign languages,
          including Spanish, Croatian, Italian and French.
        </Typography>
      </Box>
    </React.Fragment>
  );
};
export default SkillsetBox;
