import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router"; // 使用 react-router
import { useDispatch } from "react-redux";
import { updateCartData } from "../redux/cartSlices";
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

      alert("已成功加入購物車");
    } catch (error) {
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
              <li className="breadcrumb-item" aria-current="page">
                產品資訊
              </li>
            </ol>
          </nav>

          {/* 商品主要資訊 */}
          <div className="container mt-9">
            <div className="row gx-0 align-items-stretch justify-content-center">
              {/* 左側：商品圖片 */}
              <div className="col-md-6 p-0 img-container d-flex justify-content-center align-items-center">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="main-img d-block mx-auto"
                  />
                )}
              </div>

              {/* 右側：商品資訊 */}
              <div className="col-md-6 product-info d-flex flex-column justify-content-center">
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

                {/* 商品數量 */}
                <div className="input-group flex-nowrap quantity-group mt-4">
                  {/* 減少數量 */}
                  <button
                    onClick={() =>
                      setQtySelect((prev) => Math.max(1, prev - 1))
                    }
                    className="btn p-0 border-0 shadow-none d-flex align-items-center justify-content-center"
                    type="button"
                    disabled={qtySelect === 1}
                  >
                    <i className="bi bi-dash"></i>
                  </button>

                  {/* 數量輸入框 */}
                  <input
                    type="text"
                    className="form-control text-center border-0 shadow-none text-dark p-0"
                    value={qtySelect}
                    readOnly
                  />

                  {/* 增加數量 */}
                  <button
                    onClick={() => setQtySelect((prev) => prev + 1)}
                    className="btn p-0 border-0 shadow-none d-flex align-items-center justify-content-center"
                    type="button"
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>

                {/* 按鈕 */}
                <div className="product-actions mt-4">
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
