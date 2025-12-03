import { AppBar, Toolbar, Typography } from "@mui/material";
import colorConfigs from "../../../admin/configs/colorConfigs";
import sizeConfigs from "../../../admin/configs/sizeConfigs";
import { useLocation, useNavigate } from "react-router-dom";
import appRoutes from "../../../routes/admin-routes/appRoutes";
import { RouteType } from "../../../routes/admin-routes/config";
import Button from "../../common/button/Button";
import NotificationLabel from "../../../pages/notification/NotificationBell";

const Topbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const findRouteByPath = (routes: RouteType[], pathname: string) => {
    for (const route of routes) {
      if (`/admin/${route.path}` === pathname) return route;

      if (route.children) {
        for (const child of route.children) {
          if (`/admin/${route.path}/${child.path}` === pathname) {
            return child;
          }
        }
      }
    }
    return null;
  };

  const currentRoute = findRouteByPath(appRoutes, pathname);

  const handleNavigateToHome = () => {
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sizeConfigs.sidebar.width})`,
        ml: sizeConfigs.sidebar.width,
        boxShadow: "unset",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontSize: "28px", textTransform: "uppercase" }}
        >
          {currentRoute?.sidebarProps?.displayText || "Trang quản trị"}
        </Typography>

        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Button onClick={() => handleNavigateToHome()} className="btn btn-primary">
            Xem trang người dùng
          </Button>
          <div style={{ position: "relative"}}>
            <NotificationLabel />
          </div>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
