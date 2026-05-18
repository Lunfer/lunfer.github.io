import "@fontsource/dosis";
import Head from "next/head";
import TopBar from "../components/topBar";
import CustomFooter from "../components/customFooter";
import BoxGridder from "../components/boxGridder";

export default function Home() {
  return (
    <>
      <Head>
        <title>Zoe Kousteni</title>
        <meta name="description" content="Portfolio & Resume of Zoe Kousteni — Data Engineer, Analytics and AI, based in Rotterdam." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="layout">
        <div className="main-bg">
          <TopBar />
          <BoxGridder />
        </div>
        <CustomFooter />
      </div>
    </>
  );
}