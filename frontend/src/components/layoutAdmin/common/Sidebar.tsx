import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar
} from "@mui/material";
import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import colorConfigs from "../../../admin/configs/colorConfigs";
import sizeConfigs from "../../../admin/configs/sizeConfigs";
import logo from "../../../assets/quickbuyshop.png";
import LogoutConfirmPopup from "../../../pages/account/logoutConfirmPopup/LogoutConfirmPopup";
import appRoutes from "../../../routes/admin-routes/appRoutes";
import SidebarItem from "./SidebarItem";
import SidebarItemCollapse from "./SidebarItemCollapse";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("tokenWeb");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  return (
    <>
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
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <List disablePadding sx={{ flexGrow: 1 }}>
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
        <Box sx={{ padding: 2 }}>
          <ListItemButton
            onClick={() => setShowLogoutConfirm(true)}
            sx={{
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.06)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.15)",
              },
            }}
          >
            <ListItemIcon sx={{ color: colorConfigs.sidebar.color }}>
              <FaSignOutAlt />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItemButton>
        </Box>
      </Drawer>
      {showLogoutConfirm && (
        <LogoutConfirmPopup
          message="Bạn có chắc chắn muốn đăng xuất?"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
