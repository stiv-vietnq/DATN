import { ListItemButton, ListItemIcon } from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import colorConfigs from "../../../admin/configs/colorConfigs";
import { RootState } from "../../../admin/redux/store";
import { RouteType } from "../../../routes/admin-routes/config";

type Props = {
  item: RouteType;
};

const SidebarItem = ({ item }: Props) => {
  const appState = useSelector((state: RootState) => state.appState.appState);
  const location = useLocation();
  const fullPath = item.path ? `/admin/${item.path}` : "/admin";

  const isActive =
    appState === item.state || location.pathname === fullPath;

  return item.sidebarProps && item.path ? (
    <ListItemButton
      component={Link}
      to={fullPath}
      sx={{
        "&:hover": {
          backgroundColor: colorConfigs.sidebar.hoverBg,
          color: colorConfigs.sidebar.color,
        },
        backgroundColor: isActive
          ? colorConfigs.sidebar.activeBg
          : "unset",
        color: isActive
          ? colorConfigs.sidebar.activeColor || colorConfigs.sidebar.color
          : colorConfigs.sidebar.color,
        paddingY: "12px",
        paddingX: "24px",
        borderLeft: isActive ? "1px solid #1976d2" : "1px solid transparent",
      }}
    >
      <ListItemIcon
        sx={{
          color: isActive
            ? colorConfigs.sidebar.activeColor || colorConfigs.sidebar.color
            : colorConfigs.sidebar.color,
        }}
      >
        {item.sidebarProps.icon && item.sidebarProps.icon}
      </ListItemIcon>
      {item.sidebarProps.displayText}
    </ListItemButton>
  ) : null;
};

export default SidebarItem;
