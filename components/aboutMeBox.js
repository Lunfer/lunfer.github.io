import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "aos/dist/aos.css";

const AboutMeBox = () => {
  return (
    <React.Fragment>
      <Box
        id="AboutMeBox"
        data-aos="fade-right"
        data-aos-anchor="#myName"
        data-aos-anchor-placement="top-top"
        sx={{
          background: "rgba(255, 255, 255, 0.4)",
          border: "none",
          borderRadius: "40px",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Typography variant="h5" sx={{ borderBottom: "1px solid" }}>
          About me
        </Typography>
        <Typography variant="subtitle1">
          Social butterfly, Outside-of-the-box thinker and Machine Learning
          lover. Really passionate about data and the way that it can be used to
          create solutions and insights to everyday problems as well as
          &quot;larger&quot; problems. Love to learn no matter the background as
          I truly believe that every aspect of life is equally as interesting as
          any other and that is why you may find on my profile more than one
          topic that is completely different from each other like Languages, HR
          stuff and also Tech stuff. Furthermore, I was lucky enough to be able
          to spend a semester abroad while studying at the University of Osijek
          in Croatia, during the Erasmus+ program, in the Department of Computer
          Science and Electrical Engineering. Finally, as I am in my senior
          year, I am working on my AI-based Thesis.
        </Typography>
      </Box>
    </React.Fragment>
  );
};
export default AboutMeBox;
