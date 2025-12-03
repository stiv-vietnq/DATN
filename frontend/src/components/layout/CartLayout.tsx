import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer";
import Header from "./cart/Header";

export default function CartLayout() {
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
