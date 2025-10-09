import { Outlet } from "react-router-dom";
import Header from "./auth/Header";
import Footer from "./footer/Footer";

export default function AuthLayout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
