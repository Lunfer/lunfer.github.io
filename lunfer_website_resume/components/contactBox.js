import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import Link from "@mui/material/Link";

const ContactBox = () => {
  return (
    <React.Fragment>
      <Box
        id="contactBox"
        sx={{
          background: "rgba(255, 255, 255, 0.4)",
          border: "none",
          borderRadius: "40px",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ borderBottom: "1px solid" }}
        >
          Contact info
        </Typography>
        <Grid
          container
          direction="row"
          spacing={0}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={1}>
            <Link
              href="https://www.linkedin.com/in/zoikousteni/"
              sx={{ paddingTop: "2px" }}
            >
              <Image
                src="/linkedin.svg"
                alt="LinkedIn Logo"
                width={35}
                height={25}
              />
            </Link>
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="text"
              onClick={() =>
                (window.location = "mailto:zoikousteni@hotmail.com")
              }
            >
              <Image src="/email.svg" alt="Email icon" width={35} height={25} />
            </Button>
          </Grid>
          <Grid item xs={10}></Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};
export default ContactBox;
