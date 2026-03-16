import { useState } from "react";
import DarkmodeButton from "../../components/DarkmodeButton";
import MyPageButton from "../../components/MyPageButton";
import "./Home.css";

function Home() {
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    setDark(!dark);
  };

  return (
    <div className={dark ? "home-page dark" : "home-page"}>
      <DarkmodeButton toggle={toggleDark} />
      <MyPageButton />
      <h1 className="home-title">초기화면</h1>
    </div>
  );
}

export default Home;

