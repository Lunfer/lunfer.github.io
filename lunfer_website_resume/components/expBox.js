import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "aos/dist/aos.css";

const ExpBox = () => {
  return (
    <React.Fragment>
      <Box
        id="expBox"
        data-aos="fade-right"
        data-aos-anchor="#educationBox"
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
          Experience
        </Typography>
        <Typography variant="subtitle1">
          As a student, I have worked in several customer assistance - centered
          jobs but my technology-centered jobs started with an internship in
          EWORX S.A. as a Data Science Intern, in which I learned R and how to
          use it to effectively manipulate data and visualise them.{<br />}{" "}
          Additionally, I've spent a 6 month period, working as a Junior Data
          Scientist at Zero To MVP Inc, and with a focus on learning JavaScript
          and C# / .NET, and used each of these tools to automate processes, as
          well as deliver projects with API implementations.{<br />} At the
          present time, I am working as a full time Software Engineer in
          Squaredev, sharpening my JavaScript skills with various frameworks and
          libraries, while making time to also learn some back-end functionality
          with NodeJS and API creation with FastAPI.
        </Typography>
      </Box>
    </React.Fragment>
  );
};
export default ExpBox;
