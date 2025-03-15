import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router"; // 使用 react-router

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://ec-course-api.hexschool.io";
const API_PATH = import.meta.env.VITE_API_PATH || "furry_friend";

export default function ProductDetailPage() {
  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const { id: product_id } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      setIsScreenLoading(true);
      try {
        const res = await axios.get(
          `${BASE_URL}/v2/api/${API_PATH}/product/${product_id}`
        );
        console.log("API 回應資料:", res.data);
        console.log(
          "API URL:",
          `${BASE_URL}/v2/api/${API_PATH}/product/${product_id}`
        );
        setProduct(res.data.product);
      } catch (error) {
        console.error("取得產品失敗", error);
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
      alert("已成功加入購物車");
    } catch (error) {
      console.error("加入購物車失敗", error);
      alert("加入購物車失敗: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isScreenLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
        </div>
      ) : (
        <>
          {/* 商品路徑 */}
          <nav className="nav text-white text-center">
            <ol className="breadcrumb mb-0 w-100" aria-label="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white">
                  首頁
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/productlist" className="text-white">
                  產品列表
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                產品資訊
              </li>
            </ol>
          </nav>

          {/* 商品主要資訊 */}
          <div className="container mt-9">
            <div className="row gx-0 align-items-stretch justify-content-center">
              {/* 左側：商品圖片 */}
              <div className="col-md-6 col-12 p-0 img-container d-flex justify-content-center align-items-center">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="main-img d-block mx-auto"
                  />
                )}
              </div>

              {/* 右側：商品資訊 */}
              <div className="col-md-6 col-12 product-info d-flex flex-column justify-content-center">
                <h4 className="product-title">{product.title}</h4>
                <h4 className="product-price mt-4">
                  {product.price !== product.origin_price ? (
                    <>
                      <span className="product-origin-price text-decoration-line-through">
                        NT$ {product.origin_price}
                      </span>
                      <span className="product-sale-price text-danger ms-2">
                        NT$ {product.price}
                      </span>
                    </>
                  ) : (
                    <span className="product-sale-price">
                      NT$ {product.origin_price}
                    </span>
                  )}
                </h4>

                {/* 商品數量 */}
                <div className="quantity-container mt-4">
                  <div className="d-flex align-items-center">
                    <button
                      onClick={() =>
                        setQtySelect((prev) => Math.max(1, prev - 1))
                      }
                      disabled={qtySelect === 1}
                      type="button"
                      className="btn btn-outline-secondary btn-quantity"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="quantity-input text-center mx-2"
                      value={qtySelect}
                      readOnly
                    />
                    <button
                      onClick={() => setQtySelect(qtySelect + 1)}
                      type="button"
                      className="btn btn-outline-secondary btn-quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 按鈕 */}
                <div className="product-actions mt-4">
                  <button
                    type="button"
                    className="btn btn-primary w-100 py-2"
                    onClick={() => addCartItem(product_id, qtySelect)}
                    disabled={isLoading}
                  >
                    {isLoading ? "處理中..." : "加入購物車"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 商品詳情 */}
          <div className="container mt-9 mb-9">
            <div className="about-product">
              <h4 className="text-center mb-5 fs-2 text-dark">商品資訊</h4>
              <p className="text-dark">{product.content}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
