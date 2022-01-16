import "@fontsource/dosis";
import TopBar from "../components/topBar";
import CustomFooter from "../components/customFooter";

export default function Home() {
  return (
    <div>
      <div
        style={{
          backgroundImage: "url(./images/pexels_cottonbro.jpg)",
        }}
      >
        <TopBar />
      </div>

      <CustomFooter />
    </div>
  );
}
