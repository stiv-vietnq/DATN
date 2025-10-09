import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer";
import Header from "./home/Header";

export default function Layout() {
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
