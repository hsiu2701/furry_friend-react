import { Outlet, NavLink, Link } from "react-router";
export default function Header() {
  const activeClass = ({ isActive }) => {
    console.log("isActive:", isActive);
    return isActive ? "linkColor" : "";
  };
  return (
    <>
      <div className="bg-white ">
        <div className="container">
          <div className="row">
            <div className="d-flex justify-content-between align-items-center logo position-relative mt-2">
              <h1>
                <Link className="logo-style" to="">
                  毛茸茸的朋友
                </Link>
              </h1>
              <div>
                <NavLink
                  className="me-0 me-lg-6 d-none d-lg-inline-block"
                  to="/members"
                >
                  <span className="material-symbols-outlined header-icon">
                    person
                  </span>
                </NavLink>
                <NavLink
                  className="ion-me me-lg-0 mt-2 mt-lg-0 position-relative"
                  to="/cart"
                >
                  <span className="material-symbols-outlined header-icon">
                    shopping_cart
                  </span>
                  {/* <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-style">
                    10
                    <span className="visually-hidden">shopping quantity</span>
                  </span> */}
                </NavLink>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light pb-2 pb-lg-0">
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
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-ps pt-8 pt-lg-0">
                  <li className="nav-item dropdown me-120 text-center">
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
                    <a
                      className="nav-link dropdown-toggle link-gray-01 fw-bold me-120"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      貓貓
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
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
                      className="nav-link link-gray-01 fw-bold me-120"
                      to="/productlist?category=全部"
                    >
                      主打商品
                    </NavLink>
                  </li>
                  <li className="nav-item text-center">
                    <NavLink className="nav-link link-gray-01 fw-bold" to="">
                      毛孩小教室
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
