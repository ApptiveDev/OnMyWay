

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import LogoutPage from "./pages/LogoutPage/LogoutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<LogoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
