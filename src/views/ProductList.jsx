import { Link, NavLink, useLocation } from "react-router";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Offcanvas } from "bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
// import Paginationss from "../assets/components/Paginationss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

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

  // 廣告輪播
  const [productAdvertisement] = useState([
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1628195787435-4d64a0db4d0a?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "帳篷",
      introduction: "與狗狗體驗露營的樂趣",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1720745027411-56759bf10d36?q=80&w=1971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "推車",
      introduction: "輕鬆推著毛孩在露營區欣賞美景!",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1599847944101-57816855bb33?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "防蚊",
      introduction: "帶這毛孩安心出遊~  不讓蟲蟲靠近",
    },
  ]);

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

  // 收藏
  const [wishList, setWishList] = useState(() => {
    const initWishList = localStorage.getItem("wishList")
      ? JSON.parse(localStorage.getItem("wishList"))
      : {};

    return initWishList;
  });

  const toggleWishListItem = (product_id) => {
    const newWishList = {
      ...wishList,
      [product_id]: !wishList[product_id],
    };

    localStorage.setItem("wishList", JSON.stringify(newWishList));

    setWishList(newWishList);
  };
  // nav
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  //BANNER

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

      {/* 商品輪播 */}
      <div className="container">
        <div className="row">
          <Swiper
            cssMode={true}
            navigation={true}
            pagination={true}
            mousewheel={true}
            keyboard={true}
            modules={[Navigation, Pagination, Mousewheel, Keyboard]}
            className="mySwiper px-9  "
          >
            {productAdvertisement.map((item) => (
              <SwiperSlide key={item.id}>
                <div
                  className="product-ad "
                  style={{
                    backgroundImage: `url(${item.image}) `,
                  }}
                >
                  <h3 className="text-white advertisement-text">
                    {item.introduction}
                  </h3>
                  <button
                    type="button"
                    className="btn btn-brand-02 border border-white text-white rounded-pill h5 mt-9 btn-ms "
                  >
                    馬上選購
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* 手機板 */}
      <div className="d-flex justify-content-center pt-6">
        <button
          className="btn btn-brand-02 offcanvas-custom d-md-none px-8 "
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasTop"
          aria-controls="offcanvasTop"
        >
          商品列表
        </button>
      </div>
      <div
        className="offcanvas offcanvas-top d-md-none"
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
              <h5 className="ps-4 pt-1 text-gray-01">狗狗</h5>
              <div className="accordion accordion-flush" id="dogAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingDogOne">
                    <button
                      className="accordion-button collapsed text-brand-01 text-brand-01"
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
                        className="d-block text-gray-02 border-none btn "
                        onClick={() => setSelectedCategory("狗狗,飼料")}
                      >
                        飼料
                      </button>
                      <button
                        className="d-block text-gray-02 border-none btn "
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
                      className="accordion-button collapsed text-brand-01"
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
                        className="d-block text-gray-02 border-none btn "
                        onClick={() => setSelectedCategory("狗狗,衣服")}
                      >
                        衣服
                      </button>
                      <button
                        className="d-block text-gray-02 border-none btn "
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
              <h5 className="ps-4 pt-1 text-black">貓貓</h5>
              <div className="accordion accordion-flush" id="catAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingCatOne">
                    <button
                      className="accordion-button collapsed text-brand-01 "
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
                        className="d-block text-gray-02 border-none btn "
                        onClick={() => setSelectedCategory("貓咪,飼料")}
                      >
                        飼料
                      </button>
                      <button
                        className="d-block text-gray-02 border-none btn "
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
                      className="accordion-button collapsed text-brand-01"
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
                        className="d-block text-gray-02 border-none btn "
                        onClick={() => setSelectedCategory("貓咪,衣服")}
                      >
                        衣服
                      </button>
                      <button
                        className="d-block text-gray-02 border-none btn "
                        onClick={() => setSelectedCategory("貓咪,玩具")}
                      >
                        玩具
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="ps-4 pt-1 text-gray-01">篩選器</h5>
              <div className="accordion accordion-flush" id="dogAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingDogOne">
                    <button
                      className="accordion-button collapsed text-brand-01 text-brand-01"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseDogOne"
                      aria-expanded="false"
                      aria-controls="flush-collapseDogOne"
                    >
                      肉類
                    </button>
                  </h2>
                  <div
                    id="flush-collapseDogOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingDogOne"
                  >
                    <div className="accordion-body">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="chicken"
                        />
                        <label className="form-check-label" htmlFor="chicken">
                          雞肉
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="lamb"
                        />
                        <label className="form-check-label" htmlFor="lamb">
                          羊肉
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="beef"
                        />
                        <label className="form-check-label" htmlFor="beef">
                          牛肉
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="horseMeat"
                        />
                        <label className="form-check-label" htmlFor="horseMeat">
                          馬肉
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingDogTwo">
                    <button
                      className="accordion-button collapsed text-brand-01"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseDogTwo"
                      aria-expanded="false"
                      aria-controls="flush-collapseDogTwo"
                    >
                      風格
                    </button>
                  </h2>
                  <div
                    id="flush-collapseDogTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="flush-headingDogTwo"
                  >
                    <div className="accordion-body">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="cuteStyle"
                        />
                        <label className="form-check-label" htmlFor="cuteStyle">
                          可愛風
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id=" forestStyle"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckConsumables"
                        >
                          森林風
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="battleStyle"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="battleStyle"
                        >
                          戰鬥風
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingDogTwo">
                    <button
                      className="accordion-button collapsed text-brand-01"
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
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="cleaning"
                        />
                        <label className="form-check-label" htmlFor="cleaning">
                          清潔
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="ball"
                        />
                        <label className="form-check-label" htmlFor="ball">
                          球
                        </label>
                      </div>
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
            <div className="border rounded-3">
              <div>
                <h4 className="bg-gray-04 rounded-top text-center">商品列表</h4>
                <div>
                  <h5 className="ps-4 pt-1 text-gray-01">狗狗</h5>
                  <div
                    className="accordion accordion-flush"
                    id="dogAccordion-pc"
                  >
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="flush-headingDogOne">
                        <button
                          className="accordion-button collapsed text-brand-01 text-brand-01"
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
                            className="d-block text-gray-02 border-none btn "
                            onClick={() => setSelectedCategory("狗狗,飼料")}
                          >
                            飼料
                          </button>
                          <button
                            className="d-block text-gray-02 border-none btn "
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
                          className="accordion-button collapsed text-brand-01"
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
                            className="d-block text-gray-02 border-none btn "
                            onClick={() => setSelectedCategory("狗狗,衣服")}
                          >
                            衣服
                          </button>
                          <button
                            className="d-block text-gray-02 border-none btn "
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
                  <h5 className="ps-4 pt-1 text-black">貓貓</h5>
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
                          className="accordion-button collapsed text-brand-01 "
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
                            className="d-block text-gray-02 border-none btn "
                            onClick={() => setSelectedCategory("貓咪,飼料")}
                          >
                            飼料
                          </button>
                          <button
                            className="d-block text-gray-02 border-none btn "
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
                          className="accordion-button collapsed text-brand-01"
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
                            className="d-block text-gray-02 border-none btn "
                            onClick={() => setSelectedCategory("貓咪,衣服")}
                          >
                            衣服
                          </button>
                          <button
                            className="d-block text-gray-02 border-none btn "
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
              {/* 篩選器 */}
              <div className="mt-9 ms-2">
                <p className="text-gray-01 ps-2 mb-2">
                  <i className="bi bi-funnel-fill pe-1"></i>篩選器
                </p>
                <ul>
                  <li className="text-gray-01 ps-1 list-group mb-2 border-bottom rounded-0">
                    <p>肉類</p>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="chicken2"
                      />
                      <label className="form-check-label" htmlFor="chicken2">
                        雞肉
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="lamb2"
                      />
                      <label className="form-check-label" htmlFor="lamb2">
                        羊肉
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="beef2"
                      />
                      <label className="form-check-label" htmlFor="beef2">
                        牛肉
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="horseMeat2"
                      />
                      <label className="form-check-label" htmlFor="horseMeat2">
                        馬肉
                      </label>
                    </div>
                  </li>
                  <li className="text-gray-01 list-group ps-1 mb-1 border-bottom rounded-0">
                    <p>風格</p>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="cuteStyle2"
                      />
                      <label className="form-check-label" htmlFor="cuteStyle2">
                        可愛風
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="forestStyle2"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="forestStyle2"
                      >
                        森林風
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="battleStyle2"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="battleStyle2"
                      >
                        戰鬥風
                      </label>
                    </div>
                  </li>
                  <li className="text-gray-01 list-group ps-1">
                    <p>用品</p>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="cleaning2"
                      />
                      <label className="form-check-label" htmlFor="cleaning2">
                        清潔
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="ball2"
                      />
                      <label className="form-check-label" htmlFor="ball2">
                        球
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 卡片 */}

          <div className="col-md-9">
            <div className="row">
              <div className="d-flex justify-content-start  flex-wrap product-cards ">
                {products.map((product) => (
                  <div className="product-card px-2 mt-1" key={product.id}>
                    <div className="product-tumb d-flex justify-content-center align-items-end">
                      <img src={product.imageUrl} alt={product.title} />
                    </div>
                    <div className="product-details">
                      <div className="card-h">
                        <span className="product-catagory text-gray-02">
                          {product.description}
                        </span>
                        <h4>
                          <Link to={`/product/${product.id}`}>
                            {product.title}
                          </Link>
                        </h4>
                      </div>
                      <div className="product-bottom-details">
                        <div className="product-price text-brand-01">
                          <p>${product.price}</p>
                        </div>
                        <div className="product-links">
                          <button
                            onClick={() => toggleWishListItem(product.id)}
                            type="button"
                            className="btn border-none wishlist-btn"
                            data-wishlisted={
                              wishList[product.id] ? "true" : "false"
                            }
                          >
                            <i
                              className="
                               bi bi-bookmark-heart-fill"
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* <div className="pt-9">
                <Paginationss
                  pageInfo={pageInfo}
                  handlePageChange={handlePageChange}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductList;
