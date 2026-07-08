import { Outlet } from "react-router-dom";
import ScaledFrame from "./ScaledFrame";

export default function Layout() {
  return (
    <ScaledFrame>
      <Outlet />
    </ScaledFrame>
  );
}
