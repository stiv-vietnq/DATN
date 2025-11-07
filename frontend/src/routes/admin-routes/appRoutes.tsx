import { FaList } from "react-icons/fa";
import {
  FaBoxesStacked,
  FaCartShopping,
  FaMobileScreen,
  FaTrademark,
  FaUser,
} from "react-icons/fa6";
import BrandPage from "../../admin/pages/brand/BrandPage";
import CategoryPage from "../../admin/pages/category/CategoryPage";
import AnalyticsPage from "../../admin/pages/dashboard/AnalyticsPage";
import DashboardIndex from "../../admin/pages/dashboard/DashboardIndex";
import DashboardPageLayout from "../../admin/pages/dashboard/DashboardPageLayout";
import DefaultPage from "../../admin/pages/dashboard/DefaultPage";
import SaasPage from "../../admin/pages/dashboard/SaasPage";
import ProductPage from "../../admin/pages/product/ProductPage";
import { RouteType } from "./config";
import UserPage from "../../admin/pages/user/UserPage";

const appRoutes: RouteType[] = [
  {
    path: "dashboard",
    element: <DashboardPageLayout />,
    state: "dashboard",
    sidebarProps: {
      displayText: "Thống kê",
      icon: <FaMobileScreen />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "dashboard.index",
      },
      {
        path: "dashboard/default",
        element: <DefaultPage />,
        state: "dashboard.default",
        sidebarProps: {
          displayText: "Default",
        },
      },
      {
        path: "dashboard/analytics",
        element: <AnalyticsPage />,
        state: "dashboard.analytics",
        sidebarProps: {
          displayText: "Analytic",
        },
      },
      {
        path: "dashboard/saas",
        element: <SaasPage />,
        state: "dashboard.saas",
        sidebarProps: {
          displayText: "Saas",
        },
      },
    ],
  },
  {
    path: "brands",
    element: <BrandPage />,
    state: "brands",
    sidebarProps: {
      displayText: "Quản lý nhãn hàng",
      icon: <FaTrademark />,
    },
  },
  {
    path: "categories",
    element: <CategoryPage />,
    state: "categories",
    sidebarProps: {
      displayText: "Quản lý loại sản phẩm",
      icon: <FaList />,
    },
  },
  {
    path: "products",
    element: <ProductPage />,
    state: "products",
    sidebarProps: {
      displayText: "Quản lý sản phẩm",
      icon: <FaBoxesStacked />,
    },
  },
  {
    path: "purchases",
    element: <BrandPage />,
    state: "purchases",
    sidebarProps: {
      displayText: "Quản lý đơn hàng",
      icon: <FaCartShopping />,
    },
  },
  {
    path: "users",
    element: <UserPage />,
    state: "users",
    sidebarProps: {
      displayText: "Quản lý người dùng",
      icon: <FaUser />,
    },
  },
];

export default appRoutes;
