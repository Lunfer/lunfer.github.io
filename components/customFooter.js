import styles from "../styles/Home.module.css";
import * as React from "react";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const CustomFooter = () => {
  return (
    <React.Fragment>
      <footer className={styles.footer}>
        <Grid
          container
          direction="row"
          spacing={0}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={3}>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography variant="subtitle2">
                Powered by{" "}
                <span className={styles.logo}>
                  <Image
                    src="/vercel.svg"
                    alt="Vercel Logo"
                    width={62}
                    height={14}
                  />
                </span>
              </Typography>
            </a>
          </Grid>
          <Grid item xs={6}>
            <Grid
              container
              direction="row"
              spacing={0}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={2}>
                <Typography variant="subtitle2">Stack Used:</Typography>
              </Grid>
              <Grid item xs={1}>
                <Link href="https://mui.com/" sx={{ paddingTop: "2px" }}>
                  <Image
                    src="/materialUI.svg"
                    alt="Material UI Logo"
                    width={30}
                    height={16}
                  />
                </Link>
              </Grid>
              <Grid item xs={1}>
                <Link href="https://nextjs.org/" sx={{ paddingTop: "2px" }}>
                  <Image
                    src="/nextjs.svg"
                    alt="Next JS Logo"
                    width={30}
                    height={16}
                  />
                </Link>
              </Grid>
              <Grid item xs={1}>
                <Link href="https://reactjs.org/" sx={{ paddingTop: "2px" }}>
                  <Image
                    src="/react.svg"
                    alt="React JS Logo"
                    width={30}
                    height={16}
                  />
                </Link>
              </Grid>
              <Grid item xs={1}>
                <Link href="https://www.figma.com/" sx={{ paddingTop: "2px" }}>
                  <Image
                    src="/figma.svg"
                    alt="Figma Logo"
                    width={30}
                    height={16}
                  />
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid
              container
              direction="row"
              spacing={0}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <Typography variant="subtitle2">Laptop icon by </Typography>
              </Grid>
              <Grid item>
                <Link
                  target="_blank"
                  href="https://icons8.com"
                  underline="none"
                >
                  <Typography variant="subtitle2">Icons8</Typography>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </footer>
    </React.Fragment>
  );
};
export default CustomFooter;
