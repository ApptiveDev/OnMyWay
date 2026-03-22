import { useNavigate } from "react-router-dom";

function LogoutPageButton() {
  const navigate = useNavigate();

  const goToMain = () => {
    navigate("/logout");
  };

  return (
    <button onClick={goToMain} className="logout-button">
      로그아웃 버튼
    </button>
  );
}

export default LogoutPageButton;