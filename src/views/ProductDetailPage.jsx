import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useDispatch } from "react-redux";
import { updateCartData } from "../redux/cartSlices";
import { toast } from "react-toastify";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://ec-course-api.hexschool.io";
const API_PATH = import.meta.env.VITE_API_PATH || "furry_friend";

export default function ProductDetailPage() {
  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const { id: product_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const getProduct = async () => {
      setIsScreenLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/v2/api/${API_PATH}/product/${product_id}`
        );

        setProduct(res.data.product);
      } catch (error) {
        alert("取得產品失敗: " + error.message);
      } finally {
        setIsScreenLoading(false);
      }
    };
    getProduct();
  }, [product_id]);

  const addCartItem = async (product_id, qty) => {
    setIsLoading(true);
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });

      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      dispatch(updateCartData(res.data.data));

      toast.success("已加入購物車！", {
        position: "top-right",
        autoClose: 2000,
        className: "custom-toast-success",
        bodyClassName: "custom-toast-body",
        progressClassName: "custom-toast-progress",
      });
    } catch (error) {
      toast.error("加入購物車失敗: " + error.message, {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-115">
      {isScreenLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
        </div>
      ) : (
        <>
          {/* 路徑 */}
          <div className="row">
            <div className="offset-md-2 col-md-8">
              <nav className="nav">
                <ol className="breadcrumb mb-0 w-100" aria-label="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">首頁</Link>
                  </li>
                  {(() => {
                    const [animal, type] = (product.category || "").split(",");
                    return (
                      <>
                        {animal && (
                          <li className="breadcrumb-item">
                            <Link
                              to={`/productlist?category=${encodeURIComponent(
                                animal
                              )}`}
                            >
                              {animal === "貓咪"
                                ? "貓貓產品列表"
                                : "狗狗產品列表"}
                            </Link>
                          </li>
                        )}
                        {animal && type && (
                          <li className="breadcrumb-item">
                            <Link
                              to={`/productlist?category=${encodeURIComponent(
                                `${animal},${type}`
                              )}`}
                            >
                              {animal === "貓咪" ? "貓貓" : animal}
                              {type}
                            </Link>
                          </li>
                        )}
                      </>
                    );
                  })()}
                  <li className="breadcrumb-item active" aria-current="page">
                    {product.title}
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          {/* 商品主內容 */}
          <div className="row mt-4">
            <div className="offset-md-2 col-md-8">
              <div className="row gx-5 align-items-stretch product-main-content">
                {/* 左側圖片 */}
                <div className="col-md-6 img-container">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="main-img d-block mx-auto"
                    />
                  )}
                </div>

                {/* 右側資訊 */}
                <div className="col-md-6 d-flex flex-column justify-content-between product-info">
                  {/* 上方文字 */}
                  <div>
                    <h4 className="product-title">{product.title}</h4>
                    <h4 className="product-price mt-4">
                      {product.price !== product.origin_price ? (
                        <>
                          <span className="product-sale-price text-danger">
                            NT$ {product.price}
                          </span>
                          <span className="product-origin-price text-decoration-line-through ms-2">
                            NT$ {product.origin_price}
                          </span>
                        </>
                      ) : (
                        <span className="product-origin-price fw-normal">
                          NT$ {product.origin_price}
                        </span>
                      )}
                    </h4>
                  </div>

                  {/* 下方按鈕 */}
                  <div className="mt-4">
                    <div className="input-group flex-nowrap quantity-group mb-3">
                      <button
                        onClick={() =>
                          setQtySelect((prev) => Math.max(1, prev - 1))
                        }
                        className="btn-quantity btn-decrease"
                        type="button"
                        disabled={qtySelect === 1}
                      >
                        <i className="bi bi-dash"></i>
                      </button>

                      <input
                        type="text"
                        className="quantity-input"
                        value={qtySelect}
                        readOnly
                      />

                      <button
                        onClick={() => setQtySelect((prev) => prev + 1)}
                        className="btn-quantity btn-increase"
                        type="button"
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn-brand-lg solid w-100"
                      onClick={() => addCartItem(product_id, qtySelect)}
                      disabled={isLoading}
                    >
                      {isLoading ? "處理中..." : "加入購物車"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 商品詳情 */}
          <div className="row mt-5 mb-5">
            <div className="offset-md-2 col-md-8">
              <div className="about-product">
                <h4 className="text-center mb-5 fs-2 text-dark">商品資訊</h4>
                <p className="text-dark product-content">{product.content}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
