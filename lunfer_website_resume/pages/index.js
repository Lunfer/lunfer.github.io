import "@fontsource/dosis";
import TopBar from "../components/topBar";
import CustomFooter from "../components/customFooter";
import BoxGridder from "../components/boxGridder";

export default function Home() {
  return (
    <div>
      <div
        style={{
          backgroundImage: "url(./images/pexels.jpg)",
          padding: "10px",
          overflow: "hidden",
          backgroundSize: "cover",
        }}
      >
        <TopBar />
        <BoxGridder />
      </div>

      <CustomFooter />
    </div>
  );
}
