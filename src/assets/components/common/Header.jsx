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

  return (
    <>
      <div className="bg-white position-relative">
        <div className="container ">
          <div className="row">
            <div className="d-flex justify-content-between align-items-center logo position-relative mt-2">
              <h1>
                <Link className="logo-style" to="">
                  毛茸茸的朋友
                </Link>
              </h1>
              <div className="d-flex align-items-center flex-shrink-0 icon-wrapper">
                {iconRoutes.map(({ path, icon, showInMobile }) => (
                  <NavLink
                    key={path}
                    to={path}
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
                  <li className="nav-item dropdown  text-center">
                    <Link
                      className="nav-link dropdown-toggle link-gray-01 fw-bold"
                      to=""
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      狗狗
                    </Link>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <p className="link-gray-01 ps-3">食品—</p>
                        <NavLink
                          className="dropdown-item link-gray-01 ps-8"
                          to="/productlist?category=狗狗,飼料"
                        >
                          飼料
                        </NavLink>
                        <NavLink
                          className="dropdown-item link-gray-01 ps-8"
                          to="/productlist?category=狗狗,零食"
                        >
                          零食
                        </NavLink>
                      </li>
                      <li>
                        <p className="link-gray-01 ps-3">用品—</p>
                        <NavLink
                          className="dropdown-item link-gray-01 ps-8"
                          to="/productlist?category=狗狗,玩具"
                        >
                          玩具
                        </NavLink>
                        <NavLink
                          className="dropdown-item link-gray-01 ps-8"
                          to="/productlist?category=狗狗,衣服"
                        >
                          衣服
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item dropdown text-center">
                    <Link
                      className="nav-link dropdown-toggle link-gray-01 fw-bold"
                      to=""
                      id="navbarDropdown2"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      貓貓
                    </Link>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown2"
                    >
                      <li>
                        <p className="ps-3 link-gray-01">食品—</p>
                        <NavLink
                          className="dropdown-item link-gray-01 ps-8"
                          to="/productlist?category=貓咪,飼料"
                        >
                          飼料
                        </NavLink>
                        <NavLink
                          className="dropdown-item link-gray-01 ps-8"
                          to="/productlist?category=貓咪,零食"
                        >
                          零食
                        </NavLink>
                      </li>
                      <li>
                        <p className="ps-3 link-gray-01">用品—</p>
                        <NavLink
                          className="dropdown-item link-gray-01 ps-8"
                          to="/productlist?category=貓咪,玩具"
                        >
                          玩具
                        </NavLink>
                        <NavLink
                          className="dropdown-item link-gray-01 ps-8"
                          to="/productlist?category=貓咪,衣服"
                        >
                          衣服
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item text-center">
                    <NavLink
                      className="nav-link link-gray-01 fw-bold"
                      to="/productlist?category=全部"
                    >
                      主打商品
                    </NavLink>
                  </li>

                  <li className="nav-item d-inline-block d-lg-none text-center">
                    <NavLink
                      className="nav-link link-gray-01 fw-bold register"
                      to=""
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
