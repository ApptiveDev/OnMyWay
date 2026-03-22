import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboard from "./components/Onboard";
import LoginPage from "./LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboard />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
