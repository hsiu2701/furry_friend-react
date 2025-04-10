import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";

import axios from "axios";
import { Offcanvas } from "bootstrap";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const API_URL = import.meta.env.VITE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductList() {
  // 載入產品資料
  const [products, setProducts] = useState([]);
  //追蹤當前頁數
  const [pageInfo, setPageInfo] = useState({});
  const [loading, setLoading] = useState(false);

  // nav
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl || "全部"
  );

  const getProducts = async (page = 1) => {
    if (loading) return;
    setLoading(true);
    try {
      const params = { page };
      if (selectedCategory !== "全部") {
        params.category = selectedCategory;
      }

      const res = await axios.get(`${API_URL}/v2/api/${API_PATH}/products`, {
        params,
      });

      setProducts((prevProducts) =>
        page === 1 ? res.data.products : [...prevProducts, ...res.data.products]
      );
      setPageInfo(res.data.pagination);
    } catch (error) {
      console.error("取得產品失敗", error);
    } finally {
      setLoading(false);
    }
  };

  //取得資料
  useEffect(() => {
    getProducts(1);
  }, [selectedCategory]);

  //滾動產品
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        pageInfo.has_next &&
        !loading
      ) {
        getProducts(pageInfo.current_page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pageInfo, loading]);

  //  BANNER
  const categoryMappings = {
    "狗狗,零食": "狗狗 食品",
    "狗狗,飼料": "狗狗 食品",
    "狗狗,玩具": "狗狗 用品",
    "狗狗,衣服": "狗狗 用品",
    "貓咪,零食": "貓咪 食品",
    "貓咪,飼料": "貓咪 食品",
    "貓咪,玩具": "貓咪 用品",
    "貓咪,衣服": "貓咪 用品",
  };

  const bannerTitle =
    categoryMappings[selectedCategory] || selectedCategory || "主打商品";

  // 商品列表按鈕
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // 當視窗 >=768px (md 以上) 自動關閉 offcanvas
        const offcanvasElement = document.getElementById("offcanvasTop");
        const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
      }
    };

    // 監聽視窗大小變化
    window.addEventListener("resize", handleResize);

    // 清除監聽器
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // nav
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  return (
    <>
      {/* 商品banner */}
      <div className="banner-product">
        <div className="container">
          <div className="row">
            <div className="banner-dog-mt">
              <h2 className="text-white text-center benner-style">
                {bannerTitle}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* 手機板 */}
      <div className="d-flex justify-content-center pt-6">
        <button
          className="btn btn-brand-02  d-md-none px-8 "
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasTop"
          aria-controls="offcanvasTop"
        >
          商品列表
        </button>
      </div>
      <div
        className="offcanvas offcanvas-top offcanvas-custom d-md-none"
        tabIndex="-1"
        id="offcanvasTop"
        aria-labelledby="offcanvasTopLabel"
      >
        <div className="offcanvas-header">
          <h5 id="offcanvasTopLabel">商品列表</h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className=" rounded-3 mobilelist">
          <div>
            <div>
              <h5 className="ps-4 pt-1 text-gray-01 fw-bold">狗狗</h5>
              <div className="accordion accordion-flush" id="dogAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingDogOne">
                    <button
                      className="accordion-button collapsed  text-gray-01"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseDogOne"
                      aria-expanded="false"
                      aria-controls="flush-collapseDogOne"
                    >
                      食品
                    </button>
                  </h2>
                  <div
                    id="flush-collapseDogOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingDogOne"
                  >
                    <div className="accordion-body">
                      <button
                        className="d-block text-gray-02 border-0 btn  broduct-btn "
                        onClick={() => setSelectedCategory("狗狗,飼料")}
                      >
                        飼料
                      </button>
                      <button
                        className="d-block text-gray-02 border-0 btn broduct-btn "
                        onClick={() => setSelectedCategory("狗狗,零食")}
                      >
                        零食
                      </button>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingDogTwo">
                    <button
                      className="accordion-button collapsed text-gray-01"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseDogTwo"
                      aria-expanded="false"
                      aria-controls="flush-collapseDogTwo"
                    >
                      用品
                    </button>
                  </h2>
                  <div
                    id="flush-collapseDogTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingDogTwo"
                  >
                    <div className="accordion-body">
                      <button
                        className="d-block text-gray-02 border-0 btn broduct-btn "
                        onClick={() => setSelectedCategory("狗狗,衣服")}
                      >
                        衣服
                      </button>
                      <button
                        className="d-block text-gray-02 border-0 btn broduct-btn "
                        onClick={() => setSelectedCategory("狗狗,玩具")}
                      >
                        玩具
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="ps-4 pt-1 text-black fw-bold">貓貓</h5>
              <div className="accordion accordion-flush" id="catAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingCatOne">
                    <button
                      className="accordion-button collapsed text-gray-01 "
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseCatOne"
                      aria-expanded="false"
                      aria-controls="flush-collapseCatOne"
                    >
                      食品
                    </button>
                  </h2>
                  <div
                    id="flush-collapseCatOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingCatOne"
                  >
                    <div className="accordion-body">
                      <button
                        className="d-block text-gray-02 border-0 btn broduct-btn"
                        onClick={() => setSelectedCategory("貓咪,飼料")}
                      >
                        飼料
                      </button>
                      <button
                        className="d-block text-gray-02 border-0 btn broduct-btn"
                        onClick={() => setSelectedCategory("貓咪,零食")}
                      >
                        零食
                      </button>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingCatTwo">
                    <button
                      className="accordion-button collapsed text-gray-01"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseCatTwo"
                      aria-expanded="false"
                      aria-controls="flush-collapseCatTwo"
                    >
                      用品
                    </button>
                  </h2>
                  <div
                    id="flush-collapseCatTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingCatTwo"
                  >
                    <div className="accordion-body">
                      <button
                        className="d-block text-gray-02 border-0 btn broduct-btn"
                        onClick={() => setSelectedCategory("貓咪,衣服")}
                      >
                        衣服
                      </button>
                      <button
                        className="d-block text-gray-02 border-0 btn broduct-btn"
                        onClick={() => setSelectedCategory("貓咪,玩具")}
                      >
                        玩具
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 中間區域 */}
      <div className="container">
        <div className="row mt-9">
          <div className="col col-md-3 d-none d-md-block">
            {/*  電腦版列表 */}
            <div className="border rounded-3 mb-2">
              <div className="mb-6 list-h ">
                <h4 className="bg-gray-04 rounded-top text-center">商品列表</h4>
                <div>
                  <h5 className="ps-4 pt-1 text-gray-01 fw-bold">狗狗</h5>
                  <div
                    className="accordion accordion-flush"
                    id="dogAccordion-pc"
                  >
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingDogOne">
                        <button
                          className="accordion-button collapsed  text-gray-01 mb-1 "
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseDogOne-pc"
                          aria-expanded="false"
                          aria-controls="flush-collapseDogOne-pc"
                        >
                          食品
                        </button>
                      </h2>
                      <div
                        id="flush-collapseDogOne-pc"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingDogOne"
                      >
                        <div className="accordion-body">
                          <button
                            className="d-block text-gray-02 border-0 btn broduct-btn "
                            onClick={() => setSelectedCategory("狗狗,飼料")}
                          >
                            飼料
                          </button>
                          <button
                            className="d-block text-gray-02 border-0 btn broduct-btn"
                            onClick={() => setSelectedCategory("狗狗,零食")}
                          >
                            零食
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingDogTwo">
                        <button
                          className="accordion-button collapsed text-gray-01"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseDogTwo"
                          aria-expanded="false"
                          aria-controls="flush-collapseDogTwo"
                        >
                          用品
                        </button>
                      </h2>
                      <div
                        id="flush-collapseDogTwo"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingDogTwo"
                      >
                        <div className="accordion-body">
                          <button
                            className="d-block text-gray-02 border-0 btn broduct-btn"
                            onClick={() => setSelectedCategory("狗狗,衣服")}
                          >
                            衣服
                          </button>
                          <button
                            className="d-block text-gray-02 border-0 btn broduct-btn"
                            onClick={() => setSelectedCategory("狗狗,玩具")}
                          >
                            玩具
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="ps-4 pt-1 text-black fw-bold">貓貓</h5>
                  <div
                    className="accordion accordion-flush"
                    id="catAccordion-pc"
                  >
                    <div className="accordion-item">
                      <h2
                        className="accordion-header"
                        id="flush-headingCatOne-pc"
                      >
                        <button
                          className="accordion-button collapsed text-gray-01 mb-1"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseCatOne"
                          aria-expanded="false"
                          aria-controls="flush-collapseCatOne"
                        >
                          食品
                        </button>
                      </h2>
                      <div
                        id="flush-collapseCatOne"
                        className="accordion-collapse collapse"
                        aria-labelledby="flush-headingCatOne-pc"
                      >
                        <div className="accordion-body">
                          <button
                            className="d-block text-gray-02 border-0 btn broduct-btn "
                            onClick={() => setSelectedCategory("貓咪,飼料")}
                          >
                            飼料
                          </button>
                          <button
                            className="d-block text-gray-02 border-0 btn  broduct-btn"
                            onClick={() => setSelectedCategory("貓咪,零食")}
                          >
                            零食
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingCatTwo">
                        <button
                          className="accordion-button collapsed text-gray-01 "
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseCatTwo"
                          aria-expanded="false"
                          aria-controls="flush-collapseCatTwo"
                        >
                          用品
                        </button>
                      </h2>
                      <div
                        id="flush-collapseCatTwo"
                        className="accordion-collapse collapse "
                        aria-labelledby="flush-headingCatTwo"
                      >
                        <div className="accordion-body">
                          <button
                            className="d-block text-gray-02 border-0 btn broduct-btn"
                            onClick={() => setSelectedCategory("貓咪,衣服")}
                          >
                            衣服
                          </button>
                          <button
                            className="d-block text-gray-02 border-0 btn broduct-btn"
                            onClick={() => setSelectedCategory("貓咪,玩具")}
                          >
                            玩具
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 卡片 */}

          <div className="col-md-9">
            <div className="row">
              <div className="d-flex justify-content-center justify-content-md-start  flex-wrap product-cards ">
                {products.map((product) => (
                  <Link
                    to={`/product/${product.id}`}
                    className="product-card px-2 mt-1"
                    key={product.id}
                  >
                    <div className="product-tumb d-flex justify-content-center align-items-end">
                      <img src={product.imageUrl} alt={product.title} />
                    </div>
                    <div className="product-details">
                      <div className="card-h">
                        <span className="product-catagory text-gray-02">
                          {product.description}
                        </span>
                        <h4>
                          <div className="h6 text-gray-01 fw-bold ">
                            {product.title}
                          </div>
                        </h4>
                      </div>
                      <div className="product-bottom-details">
                        <div className="product-price text-brand-01">
                          <p>NT${product.price}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductList;
