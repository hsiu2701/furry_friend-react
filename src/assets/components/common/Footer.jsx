import { Link } from "react-router";
export default function Footer() {
  return (
    <>
      <div className="bg-white mt-8">
        <div className="container">
          <div className="row">
            <div className="footer-h">
              <ul className="list-unstyled d-flex justify-content-between flex-wrap">
                <li>
                  <h4 className="text-gray-01 mb-3 ms-4 ms-lg-0 fw-600">
                    購物服務 Services
                  </h4>
                  <div className="d-flex flex-column">
                    <Link
                      className="py-4 ps-4 mb-lg-2 ps-lg-0 py-lg-0 haver-brand-01 link-style footer-active"
                      to=""
                    >
                      <span className="material-symbols-outlined text-brand-01 align-middle">
                        shopping_bag{" "}
                      </span>
                      付款運送說明
                    </Link>
                    <Link
                      className="py-4 ps-4 pb-lg-2 ps-lg-0 py-lg-0 link-style haver-brand-01 footer-active"
                      to=""
                    >
                      <span className="material-symbols-outlined text-brand-01 align-middle">
                        box{" "}
                      </span>
                      商品退貨說明
                    </Link>
                    <Link
                      className="py-4 ps-4 pb-lg-2 ps-lg-0 py-lg-0 link-style haver-brand-01 footer-active"
                      to="/admin"
                    >
                      後台管理
                    </Link>
                  </div>
                </li>
                <li>
                  <h4 className="text-gray-01 mt-md-0 mb-lg-3 ms-4 ms-lg-0 fw-600">
                    聯絡我們 Contact us
                  </h4>
                  <div>
                    <a
                      className="haver-brand-01 py-4 ps-4 mb-lg-2 ps-lg-0 py-lg-0 link-style footer-active"
                      href="tel:+886-1-1111111"
                    >
                      <span className="material-symbols-outlined text-brand-01 align-middle">
                        call{" "}
                      </span>
                      服務電話 111-111-111
                    </a>
                    <p className="py-4 ps-4 pb-lg-2 ps-lg-0 py-lg-0 text-gray-01">
                      <span className="material-symbols-outlined text-brand-01 align-middle">
                        store{" "}
                      </span>
                      服務時間 11:00 - 17:00
                    </p>
                  </div>
                </li>
                <li className="d-flex flex-column">
                  <h4 className="text-gray-01 mt-9 mt-md-0 mb-lg-3 pt-9 pt-md-0 media-br ms-4 ms-lg-0 fw-600">
                    社群媒體 Social Media
                  </h4>
                  <div className="ms-4 ms-lg-0">
                    <a
                      className="text-gray-01 media d-inline me-3 mb-lg-2"
                      href="#"
                    >
                      <i className="bi-facebook haver-brand-01 footer-active"></i>
                    </a>
                    <a className="text-gray-01 media" href="#">
                      <i className="bi-instagram haver-brand-01 footer-active"></i>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
            <div className="py-0 py-lg-10 footer-br">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <h2>
                  <Link className="logo-style" to=""></Link>
                </h2>
                <p className="footer-fs footer-w ms-4 ms-lg-0 fw-bold">
                  愛你的毛小孩，如愛你的家人一樣。給牠最好的選擇
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
