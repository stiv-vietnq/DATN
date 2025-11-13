import { Outlet } from "react-router-dom";

const DashboardPageLayout = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default DashboardPageLayout;