import { Route, Routes } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import CartLayout from "../components/layout/CartLayout";
import Layout from "../components/layout/Layout";
import MainLayout from "../components/layoutAdmin/layout/MainLayout";
import ForgotPassword from "../pages/account/forgotPassword/ForgotPassword";
import Login from "../pages/account/login/Login";
import Register from "../pages/account/register/Register";
import Verify from "../pages/account/verify/Verify";
import Cart from "../pages/cart/Cart";
import Home from "../pages/home/Home";
import Products from "../pages/products/Products";
import ProductDetail from "../pages/products/productDetail/productDetail";
import Purchases from "../pages/purchase/Purchases";
import TopProduct from "../pages/topProduct/TopProduct";
import User from "../pages/user/User";
import Profile from "../pages/user/profile/Profile";
import Purchase from "../pages/user/purchase/Purchase";
import { renderRoutes } from "./RenderRoutes";
import appRoutes from "./admin-routes/appRoutes";
import Address from "../pages/user/address/Address";
import ChangePassword from "../pages/user/change-password/ChangePassword";
import PurchasesSuccess from "../pages/purchase/purchasesSuccess/PurchasesSuccess";
import ChatBox from "../pages/chat/ChatBox";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/top-products" element={<TopProduct />} />
        <Route path="/chat" element={<ChatBox />} />
        <Route path="/user" element={<User />}>
          <Route path="profile" element={<Profile />} />
          <Route path="address" element={<Address />} />
          <Route path="purchases" element={<Purchase />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      <Route element={<CartLayout />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/purchases-success" element={<PurchasesSuccess />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify />} />
      </Route>

      <Route element={<MainLayout />} path="/admin/*">
        <Route >{renderRoutes(appRoutes)}</Route>
      </Route>
    </Routes>
  );
}
