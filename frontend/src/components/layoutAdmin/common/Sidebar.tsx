import { Avatar, Box, Drawer, List, Stack, Toolbar } from "@mui/material";
import colorConfigs from "../../../admin/configs/colorConfigs";
import sizeConfigs from "../../../admin/configs/sizeConfigs";
import appRoutes from "../../../routes/admin-routes/appRoutes";
import SidebarItem from "./SidebarItem";
import SidebarItemCollapse from "./SidebarItemCollapse";
import logo from "../../../assets/quickbuyshop.png";

interface AppRoute {
  path: string;
  sidebarProps?: any;
  children?: any;
}

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sizeConfigs.sidebar.width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: sizeConfigs.sidebar.width,
          boxSizing: "border-box",
          borderRight: "0px",
          backgroundColor: colorConfigs.sidebar.bg,
          color: colorConfigs.sidebar.color,
        },
      }}
    >
      <List disablePadding>
        <Toolbar sx={{ marginBottom: "20px" }}>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: "100%",
              height: 80,
              borderRadius: 2,
              cursor: "pointer",
            }}
          />
          <Stack
            sx={{ width: "100%" }}
            direction="row"
            justifyContent="center"
          ></Stack>
        </Toolbar>
        {appRoutes.map((route, index) =>
          route.sidebarProps ? (
            route.children ? (
              <SidebarItemCollapse item={route} key={index} />
            ) : (
              <SidebarItem item={route} key={index} />
            )
          ) : null
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
