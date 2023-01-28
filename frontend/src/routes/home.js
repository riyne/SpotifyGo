import "../App.css";
import GenericButton from "../components/GenericButton";
import Divider from "@mui/material/Divider";

export default function Home() {
  return (
    <div className="center-font">
      <header className="Home-color header home-height">
        <Title />
        <div className="flex-grow-med" />
      </header>
      {/* <div className="flex-grow-small" /> */}
      <Divider
        // variant="middle"
        flexItem="true"
        className="divider"
        textAlign="center"
        // absolute="true"
        sx={{
          borderBottomWidth: 5,
          borderColor: "#06D6A0",
          width: 0.25,
          marginLeft: "37.5%",
          marginRight: "37.5%",
        }}
      />
      <div className="Home-bottom">
        <GenericButton />
      </div>
    </div>
  );
}

function Title(props) {
  return (
    <>
      <h1 className="bottom-margin-0">SpotifyGo</h1>
      <p>Never waste a moment</p>
    </>
  );
}