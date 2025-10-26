import { Route, Routes } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Layout from "../components/layout/Layout";
import ForgotPassword from "../pages/account/forgotPassword/ForgotPassword";
import Login from "../pages/account/login/Login";
import Register from "../pages/account/register/Register";
import Verify from "../pages/account/verify/Verify";
import Home from "../pages/home/Home";
import Products from "../pages/products/Products";
import ProductDetail from "../pages/products/productDetail/productDetail";
import TopProduct from "../pages/topProduct/TopProduct";
import User from "../pages/user/User";
import Profile from "../pages/user/profile/Profile";
import Purchase from "../pages/user/purchase/Purchase";
import Cart from "../pages/cart/Cart";
import CartLayout from "../components/layout/CartLayout";
import { renderRoutes } from "./RenderRoutes";
import appRoutes from "./admin-routes/appRoutes";
import MainLayout from "../components/layoutAdmin/layout/MainLayout";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/top-products" element={<TopProduct />} />
        <Route path="/user" element={<User />}>
          <Route path="profile" element={<Profile />} />
          <Route path="purchases" element={<Purchase />} />
        </Route>
      </Route>

      <Route element={<CartLayout />}>
        <Route path="/cart" element={<Cart />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/admin/*">{renderRoutes(appRoutes)}</Route>
      </Route>
    </Routes>
  );
}
