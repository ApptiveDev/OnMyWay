import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div style={{ fontFamily: "'Noto Serif KR', serif" }}>
      <Header />
      <Outlet />
    </div>
  );
}
