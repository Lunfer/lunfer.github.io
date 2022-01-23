import Head from "next/head";
import "../styles/globals.css";
import { ThemeProvider } from "@mui/material";
import { Theme } from "../src/theme";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const MyApp = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-in-out-back",
      once: false,
      offset: 50,
      delay: 10,
    });
  }, []);

  return (
    <div>
      <Head>
        <title>Zoi Kousteni</title>
        <meta name="description" content="Zoi's Resume" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={Theme}>
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </div>
  );
};

export default MyApp;
