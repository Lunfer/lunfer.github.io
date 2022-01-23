import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "aos/dist/aos.css";

const EducationBox = () => {
  return (
    <React.Fragment>
      <Box
        id="educationBox"
        data-aos="fade-left"
        data-aos-anchor="#AboutMeBox"
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
          Education
        </Typography>
        <Typography variant="subtitle1">
          Currently a senior student at the University of West Attica in the
          department of Industrial Design and Production Engineering, formerly
          known as the department of Automation Engineering, pursuing my
          Bachelor&apos;s degree. {<br />} I have also successfully attended a
          semester at the University of Osijek in Croatia, in the department of
          Electrical Engineering and Computer Science, as an Erasmus+ student.
          During this period I took up Croatian language courses that helped me
          into getting my A1 degree, as well as some other courses like
          &quot;Cryptography and System security&quot;.
        </Typography>
      </Box>
    </React.Fragment>
  );
};
export default EducationBox;
