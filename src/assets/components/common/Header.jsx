import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router";
export default function Header() {
  const iconRoutes = [
    {
      path: "/Members",
      icon: "person",
      name: "會員",
      showInMobile: false,
    },
    {
      path: "/cart",
      icon: "shopping_cart",
      name: "購物車",
      showInMobile: true,
    },
  ];

  const carts = useSelector((state) => state.cart.carts);
  const cartCount = carts.reduce((total, item) => total + item.qty, 0);

  //漢堡收起選單
  const handleNavClick = () => {
    const toggler = document.querySelector(".navbar-toggler");
    const menu = document.getElementById("navbarSupportedContent");
    if (toggler && menu && menu.classList.contains("show")) {
      toggler.click();
    }
  };

  return (
    <>
      <div className="Header-fixed">
        <div className="container ">
          <div className="row">
            <div className="d-flex justify-content-between align-items-center logo position-relative mt-2">
              <h1>
                <Link
                  className="logo-style"
                  to=""
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  毛茸茸的朋友
                </Link>
              </h1>
              <div className="d-flex align-items-center flex-shrink-0 icon-wrapper">
                {iconRoutes.map(({ path, icon, showInMobile }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className={`me-0 me-lg-4 ${
                      !showInMobile ? "d-none d-lg-inline-block" : ""
                    } position-relative`}
                  >
                    <i className="material-symbols-outlined header-icon mt-2">
                      {icon}
                    </i>
                    {path === "/cart" && cartCount > 0 && (
                      <span className="position-absolute badge text-bg-danger text-white rounded-circle badge-i">
                        {cartCount}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <nav className="navbar navbar-expand-lg navbar-light pb-2 pb-lg-0 ">
            <div className="container-fluid">
              <button
                className="navbar-toggler fs-6 position-nav"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div
                className="collapse navbar-collapse menu-absolute"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav w-100 justify-content-lg-center d-lg-flex nav-gap pt-8 pt-lg-0">
                  <li className="nav-item   text-center">
                    <Link
                      className="nav-link link-gray-01 fw-bold"
                      to="/productlist?category=狗狗"
                      onClick={(e) => {
                        handleNavClick(e);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      狗狗
                    </Link>
                  </li>

                  <li className="nav-item text-center">
                    <Link
                      className="nav-link link-gray-01 fw-bold"
                      to="/productlist?category=貓咪"
                      onClick={(e) => {
                        handleNavClick(e);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      貓貓
                    </Link>
                  </li>

                  <li className="nav-item text-center">
                    <NavLink
                      className="nav-link link-gray-01 fw-bold"
                      to="/productlist?category=全部"
                      onClick={(e) => {
                        handleNavClick(e);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      全部商品
                    </NavLink>
                  </li>

                  <li className="nav-item d-inline-block d-lg-none text-center">
                    <NavLink
                      className="nav-link link-gray-01 fw-bold register"
                      to=""
                      onClick={(e) => {
                        handleNavClick(e);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      註冊/登入
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
