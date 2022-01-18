import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  HideBetween,
  HideDuring,
  HideOn,
  HideScroll,
} from "react-hide-on-scroll";

const ExpBox = () => {
  return (
    <React.Fragment>
      <HideOn atHeight height={1000}>
        <Box
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Typography>
        </Box>
      </HideOn>
    </React.Fragment>
  );
};
export default ExpBox;
