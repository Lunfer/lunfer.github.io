import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutMeBox = () => {
  return (
    <React.Fragment>
      <Box
        id="AboutMeBox"
        data-aos="fade-left"
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Typography>
      </Box>
    </React.Fragment>
  );
};
export default AboutMeBox;