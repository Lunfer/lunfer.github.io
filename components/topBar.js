import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import "aos/dist/aos.css";
import InspoQuote from "./inspoQuote";

const TopBar = () => {
  const router = useRouter();
  return (
    <React.Fragment>
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <AppBar
          position="relative"
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            backgroundImage: "none",
            width: "100%",
            height: "100vh",
            textAlign: "center",
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            position="absolute"
            sx={{ top: "40%" }}
          >
            <Grid item xs></Grid>
            <Grid item xs={6}>
              <Typography
                id="myName"
                variant="h1"
                component="h1"
                align="center"
                sx={{ flexGrow: 1 }}
                gutterBottom
              >
                Zoi{" "}
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    display: "inline-block",
                    color: "white",
                  }}
                >
                  Kousteni
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs>
              <Button
                variant="outlined"
                size="small"
                onClick={() => router.push("/#contactBox")}
                sx={{
                  background: "rgba(255, 255, 255, 0.4)",
                  border: "none",
                  display: { xs: "none", sm: "block" },
                  "&:hover": {
                    border: "1px solid black",
                    background: "rgba(255, 255, 255, 0.4)",
                  },
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: "black", textTransform: "Capitalize" }}
                >
                  Contact me
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h4"
                component="h4"
                sx={{
                  display: "inline-block",
                  color: "white",
                }}
              >
                <InspoQuote />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <KeyboardArrowDownOutlinedIcon
                id="arrow"
                className="arrow bounce"
                sx={{ color: "white", fontSize: "80px" }}
              />
            </Grid>
          </Grid>
        </AppBar>
      </Box>
    </React.Fragment>
  );
};
export default TopBar;
