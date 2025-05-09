import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";

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
  const [subCategory, setSubCategory] = useState(null);
  const lastRequestedTimeRef = useRef(0);
  const loadingRef = useRef(false);
  const closeOffcanvas = () => {
    const offcanvasEl = document.getElementById("offcanvasTop");
    const bsOffcanvas = Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  };
  const navigate = useNavigate();
  // nav
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl || "全部"
  );

  //抓分類資料
  const categoryGroups = useMemo(
    () => ({
      狗狗: ["狗狗,飼料", "狗狗,零食", "狗狗,衣服", "狗狗,玩具"],
      貓咪: ["貓咪,飼料", "貓咪,零食", "貓咪,衣服", "貓咪,玩具"],
      全部: [
        "狗狗,飼料",
        "貓咪,飼料",
        "狗狗,零食",
        "貓咪,零食",
        "狗狗,衣服",
        "貓咪,衣服",
        "狗狗,玩具",
        "貓咪,玩具",
      ],
    }),
    []
  );

  const getProducts = useCallback(
    async (page = 1, cat = selectedCategory, sub = subCategory) => {
      const now = Date.now();
      if (loading || now - lastRequestedTimeRef.current < 1000) return;
      lastRequestedTimeRef.current = now;

      setLoading(true);
      try {
        const categories = sub
          ? cat === "全部"
            ? [`狗狗,${sub}`, `貓咪,${sub}`]
            : [`${cat},${sub}`]
          : categoryGroups[cat] || [];

        const responses = await Promise.all(
          categories.map((cat) =>
            axios
              .get(`${API_URL}/v2/api/${API_PATH}/products`, {
                params: { page, category: cat },
              })
              .catch((err) => {
                console.warn("某個類別取得失敗", cat, err);
                return null; // 讓失敗的請求不爆錯
              })
          )
        );

        const allProducts = responses
          .filter((res) => res && res.data && res.data.products)
          .flatMap((res) => res.data.products);

        const hasNext = responses.some(
          (res) => res?.data?.pagination?.has_next
        );
        const currentPage =
          responses.find((res) => res?.data?.pagination)?.data.pagination
            .current_page || 1;

        setProducts((prev) =>
          page === 1 ? allProducts : [...prev, ...allProducts]
        );
        setPageInfo({ has_next: hasNext, current_page: currentPage });
      } catch (error) {
        console.error("取得產品失敗", error);
      } finally {
        setLoading(false);
      }
    },
    [loading, selectedCategory, subCategory, categoryGroups]
  );

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
  }, [pageInfo, loading, getProducts]);

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
    categoryMappings[selectedCategory] ||
    (selectedCategory === "狗狗"
      ? "狗狗 "
      : selectedCategory === "貓咪"
      ? "貓貓 "
      : selectedCategory || "全部商品");

  // 商品列表按鈕自動關閉 offcanvas
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        const offcanvasElement = document.getElementById("offcanvasTop");
        const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // nav

  useEffect(() => {
    const rawCategory =
      new URLSearchParams(location.search).get("category") || "全部";
    const [main, sub] = rawCategory.split(",");

    setSelectedCategory(main || "全部");
    setSubCategory(sub || null);

    const now = Date.now();
    if (loadingRef.current || now - lastRequestedTimeRef.current < 1000) return;
    lastRequestedTimeRef.current = now;
    loadingRef.current = true;

    const categories = sub
      ? main === "全部"
        ? [`狗狗,${sub}`, `貓咪,${sub}`]
        : [`${main},${sub}`]
      : categoryGroups[main] || [];

    setLoading(true);
    Promise.all(
      categories.map((cat) =>
        axios
          .get(`${API_URL}/v2/api/${API_PATH}/products`, {
            params: { page: 1, category: cat },
          })
          .catch((err) => {
            console.warn("某個類別取得失敗", cat, err);
            return null;
          })
      )
    )
      .then((responses) => {
        const allProducts = responses
          .filter((res) => res?.data?.products)
          .flatMap((res) => res.data.products);
        const hasNext = responses.some(
          (res) => res?.data?.pagination?.has_next
        );
        const currentPage =
          responses.find((res) => res?.data?.pagination)?.data.pagination
            .current_page || 1;

        setProducts(allProducts);
        setPageInfo({ has_next: hasNext, current_page: currentPage });
      })
      .catch((error) => {
        console.error("取得產品失敗", error);
      })
      .finally(() => {
        setLoading(false);
        loadingRef.current = false;
      });
  }, [location.search, categoryGroups]);

  const handleDesktopClick = (item) => {
    const category = `${selectedCategory},${item}`;
    const newUrl = `#/productlist?category=${encodeURIComponent(category)}`;

    window.location.href = newUrl;

    setSubCategory(item);

    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    getProducts(1);
  }, [getProducts]);

  //bb

  return (
    <>
      {/* 商品banner */}
      <div className="banner-product">
        <div className="container">
          <div className="row">
            <div className="banner-dog-mt">
              <h2 className="text-white text-center banner-text2">
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
        <div className="  mobilelist">
          <div>
            <div className="accordion accordion-flush" id="dogAccordion">
              <div>
                {Object.entries({
                  食品: ["飼料", "零食"],
                  用品: ["衣服", "玩具"],
                }).map(([group, items]) => (
                  <div key={group} className="accordion-item border-0">
                    <h6 className="mb-2 text-gray-01 ps-1 fw-medium">
                      {group}-
                    </h6>
                    <ul className="list-unstyled ps-8">
                      {items.map((item) => (
                        <li key={item}>
                          <button
                            className="d-block text-gray-02 border-0 btn btn-u"
                            onClick={() => {
                              const category = `${selectedCategory},${item}`;
                              navigate(
                                `/productlist?category=${encodeURIComponent(
                                  category
                                )}`
                              );
                              setSubCategory(item);
                              closeOffcanvas();
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
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
              <div className="mb-6 list-h  ">
                <h4 className="bg-gray-04 rounded-top text-center mb-3">
                  商品列表
                </h4>
                <div className="px-1">
                  {Object.entries({
                    食品: ["飼料", "零食"],
                    用品: ["衣服", "玩具"],
                  }).map(([group, items]) => (
                    <div className="accordion-item" key={group}>
                      <h6 className="mb-2 text-gray-01 fw-medium ps-1">
                        {group}-
                      </h6>
                      <ul className="list-unstyled ps-8">
                        {items.map((item) => (
                          <li key={item}>
                            <button
                              className="d-block text-gray-02 border-0 btn btn-u"
                              onClick={() => handleDesktopClick(item)}
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 卡片 */}

          <div className="col-md-9">
            <div className="row">
              <div className="d-flex   flex-wrap product-cards ">
                {products.map((product) => (
                  <Link
                    to={`/product/${product.id}`}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
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
                          <p>NT$ {product.price.toLocaleString("zh-TW")}</p>
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
