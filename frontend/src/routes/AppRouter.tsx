import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import Layout from "../components/layout/Layout";
import AuthLayout from "../components/layout/AuthLayout";
import Login from "../pages/account/login/Login";
import Register from "../pages/account/register/Register";
import ForgotPassword from "../pages/account/forgotPassword/ForgotPassword";
import Verify from "../pages/account/verify/Verify";
import Products from "../pages/products/Products";
import User from "../pages/user/User";
import Profile from "../pages/user/profile/Profile";
import Purchase from "../pages/user/purchase/Purchase";
import TopProduct from "../pages/topProduct/TopProduct";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/top-products" element={<TopProduct />} />
        <Route path="/user" element={<User />} >
          <Route path="profile" element={<Profile />} />
          <Route path="purchases" element={<Purchase />} />
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify />} />
      </Route>
    </Routes>
  );
}
