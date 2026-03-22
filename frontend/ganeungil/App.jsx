import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboard_new from "./components/Onboard_new";    
import LoginPage from "./LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboard_new />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
