import { Outlet } from "react-router";
import Header from "./assets/components/common/Header";
import Footer from "./assets/components/common/Footer";
function Layout() {
  return (
    <>
      <Header />
      <div className="pt-header" />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
