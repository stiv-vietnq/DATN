import { FaDiscord, FaList } from "react-icons/fa";
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
import DashboardPageLayout from "../../admin/pages/dashboard/DashboardPageLayout";
import PurchasesDashboardPage from "../../admin/pages/dashboard/PurchasesDashboardPage";
import ProductPage from "../../admin/pages/product/ProductPage";
import UserPage from "../../admin/pages/user/UserPage";
import { RouteType } from "./config";
import SummaryStatistics from "../../admin/pages/dashboard/SummaryStatistics";
import PurchasePage from "../../admin/pages/purchase/PurchasePage";
import ProductStatistics from "../../admin/pages/dashboard/ProductStatistics";

const appRoutes: RouteType[] = [
  {
    path: "dashboard",
    element: <DashboardPageLayout />,
    state: "dashboard",
    sidebarProps: {
      displayText: "Thống kê",
      icon: <FaMobileScreen />,
    },
    children: [
      {
        index: true,
        path: "summary-statistic",
        element: <SummaryStatistics />,
        state: "dashboard.summaryStatistics",
        sidebarProps: {
          displayText: "Thống kê doanh thu",
        },
      },
      {
        index: true,
        path: "analytics",
        element: <AnalyticsPage />,
        state: "dashboard.analytics",
        sidebarProps: {
          displayText: "Thông kê truy cập",
        },
      },
      {
        index: true,
        path: "default",
        element: <PurchasesDashboardPage />,
        state: "dashboard.default",
        sidebarProps: {
          displayText: "Thống kê đơn hàng",
        },
      },
      {
        index: true,
        path: "product-statistics",
        element: <ProductStatistics />,
        state: "dashboard.productStatistics",
        sidebarProps: {
          displayText: "Thống kê sản phẩm",
        },
      }
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
    element: <PurchasePage />,
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
  {
    path: "discounts",
    element: <UserPage />,
    state: "discounts",
    sidebarProps: {
      displayText: "Quản lý giảm giá",
      icon: <FaDiscord />,
    },
  },
];

export default appRoutes;
