import Head from "next/head";
import "../styles/globals.css";
import { ThemeProvider } from "@mui/material";
import { Theme } from "../src/theme";

const MyApp = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout ?? ((page) => page);

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
