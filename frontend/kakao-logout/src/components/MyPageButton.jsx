import { useNavigate } from "react-router-dom";
import "../pages/Home/Home.css";

function MyPageButton() {
  const navigate = useNavigate();

  const goToMain = () => {
    navigate("/mypage");
  };

  return (
    <button onClick={goToMain} className="mypage-button">
      마이페이지 버튼
    </button>
  );
}

export default MyPageButton;