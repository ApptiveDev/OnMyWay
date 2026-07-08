import { Outlet } from "react-router-dom";
import ScaledFrame from "./ScaledFrame";

export default function Layout() {
  return (
    <div
      className="fixed inset-0 flex flex-col bg-[#FFFBEC]"
      style={{ fontFamily: "'Noto Serif KR', serif" }}
    >
      <Header />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
