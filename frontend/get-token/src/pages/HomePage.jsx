import LogoutPageButton from "../button/LogoutPageButton";

function HomePage() {
  return (
    <div className="my-page">
      <LogoutPageButton />
      <h1 className="home-title">초기화면</h1>
    </div>
  );
}

export default HomePage;