// eslint-disable-next-line no-unused-vars
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
// import LoadingSpinner from "/pages/LoadingSpinner";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;
function Checkout() {
  const [cartData, setCartData] = useState({
    carts: [],
    total: 0,
    final_total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    mode: "onChange", // 即時驗證
    defaultValues: {
      // 從本地存儲加載上次的值（如果有）
      ...JSON.parse(localStorage.getItem("checkoutInfo") || "{}"),
    },
  });

  // 實時監視表單值變化
  const formValues = watch();

  // 將表單值保存到 localStorage
  useEffect(() => {
    localStorage.setItem("checkoutInfo", JSON.stringify(formValues));
  }, [formValues]);

  // 檢查購物車是否為空的 memoized 值
  const isCartEmpty = useMemo(() => {
    return cartData.carts.length === 0;
  }, [cartData.carts]);

  // 獲取購物車資料
  useEffect(() => {
    const getCart = async () => {
      try {
        setApiError("");
        const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
        if (res.data.success) {
          setCartData(res.data.data);
        }
      } catch (error) {
        console.error("獲取購物車失敗:", error);
        setApiError("無法載入購物車資料，請重新整理或稍後再試。");
      } finally {
        setIsLoading(false);
      }
    };

    getCart();
  }, []);

  // 提交訂單資料
  const onSubmit = handleSubmit(async (data) => {
    if (isCartEmpty) {
      setApiError("購物車是空的，請先加入商品");
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      // 準備訂單資料
      const order = {
        user: {
          name: data.name,
          email: data.email,
          tel: data.phone,
          address: data.address,
        },
        message: data.message,
      };

      // 建立訂單
      const res = await axios.post(`${BASE_URL}/api/${API_PATH}/order`, {
        data: order,
      });

      if (res.data.success) {
        // 將訂單資訊儲存到 sessionStorage 以便在下一個頁面使用
        // (使用 sessionStorage 而非 localStorage 提高安全性)
        sessionStorage.setItem(
          "currentOrder",
          JSON.stringify({
            orderId: res.data.orderId,
            orderData: order,
            total: cartData.final_total,
            timestamp: new Date().getTime(),
          })
        );

        // 導航到付款頁面
        navigate("/checkout-payment");
      } else {
        throw new Error(res.data.message || "建立訂單失敗");
      }
    } catch (error) {
      console.error("建立訂單失敗:", error);
      setApiError(
        error.response?.data?.message || "建立訂單時發生錯誤，請稍後再試"
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  // 返回購物車
  const handleBackToCart = () => {
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center py-5"
        style={{ height: "50vh" }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {/* header */}
      <header>
        <div className="checkout-menu">
          <div className="checkout-menuTop">
            <div className="checkout-menuTopTitle">
              <Link to="/">
                <img
                  className="checkout-toolBarTopTitleImg"
                  src="./title.png"
                  alt="商標"
                />
              </Link>
            </div>
            <div className="checkout-menuTopIcon">
              <Link to="/profile">
                <i className="bi bi-person"></i>
              </Link>
              <Link to="/cart">
                <i className="bi bi-cart3"></i>
              </Link>
            </div>
          </div>
          <div className="checkout-menuBottom">
            <div className="dropdown">
              <button
                className="btn dropdown-toggle checkout-dropdown-navbar"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                狗狗
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/category/dog-food">
                    狗狗食品
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/dog-toys">
                    狗狗玩具
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/category/dog-accessories"
                  >
                    狗狗配件
                  </Link>
                </li>
              </ul>
            </div>
            <div className="dropdown">
              <button
                className="btn dropdown-toggle checkout-dropdown-navbar"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                貓貓
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/category/cat-food">
                    貓貓食品
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/cat-toys">
                    貓貓玩具
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/category/cat-accessories"
                  >
                    貓貓配件
                  </Link>
                </li>
              </ul>
            </div>
            <Link to="/featured" className="checkout-dropdown-navbar">
              主打商品
            </Link>
            <Link to="/pet-school" className="checkout-dropdown-navbar">
              毛孩教室
            </Link>
          </div>
        </div>
      </header>

      {/* banner 與主要內容 */}
      <section className="checkout-banner">
        <div
          className="checkout-bannerImg"
          style={{
            backgroundImage: 'url("./banner.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="checkout-bannerText">填寫結帳資訊</div>
        </div>

        {apiError && (
          <div
            className="alert alert-danger mx-auto mt-3"
            style={{ maxWidth: "900px" }}
          >
            {apiError}
          </div>
        )}

        <div className="checkout-container">
          <div className="checkout-containerbanner">
            <ul className="checkout-step-list">
              <li className="checkout-step-item active">
                <div className="checkout-step-circle active">
                  <i className="fas fa-check checkout-step-check"></i>
                </div>
                <span className="checkout-step-text">確認資訊</span>
              </li>
              <li className="checkout-step-item">
                <div className="checkout-step-circle">2</div>
                <span className="checkout-step-text">付款方式</span>
              </li>
              <li className="checkout-step-item">
                <div className="checkout-step-circle">3</div>
                <span className="checkout-step-text">完成訂購</span>
              </li>
            </ul>
          </div>

          <div className="checkout-containercontentbox">
            {isCartEmpty ? (
              <div className="text-center py-5">
                <h3>您的購物車是空的</h3>
                <p className="mt-3">請先加入商品再進行結帳</p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => navigate("/")}
                >
                  開始購物
                </button>
              </div>
            ) : (
              <div className="checkout-containercontentbox2">
                {/* 左側：訂單摘要 */}
                <div className="checkout-containercontentbox2text2">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="checkout-containercontentbox2title2">
                      購物車摘要
                    </h3>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleBackToCart}
                    >
                      編輯購物車
                    </button>
                  </div>
                  <div
                    className="checkout-vertical-group"
                    style={{
                      gap: "20px",
                      maxHeight: "350px",
                      overflowY: "auto",
                    }}
                  >
                    {cartData.carts.map((item) => (
                      <div className="d-flex" key={item.id}>
                        <img
                          src={
                            item.product.imageUrl ||
                            "https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1916&q=80"
                          }
                          alt={item.product.title}
                          style={{
                            width: "48px",
                            height: "48px",
                            objectFit: "cover",
                            marginRight: "10px",
                          }}
                        />
                        <div className="order-details">
                          <p className="fw-bold">{item.product.title}</p>
                          <p>NT${item.final_total.toLocaleString()}</p>
                          <p className="fw-bold">x{item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <table className="table mt-4 border-top border-bottom text-muted">
                    <tbody>
                      <tr>
                        <th className="border-0 px-0 pt-4">小計</th>
                        <td className="text-end border-0 px-0 pt-4">
                          NT${cartData.total.toLocaleString()}
                        </td>
                      </tr>
                      {cartData.final_total !== cartData.total && (
                        <tr>
                          <th className="border-0 px-0 pt-0">折扣</th>
                          <td className="text-end border-0 px-0 pt-0 text-danger">
                            -NT$
                            {(
                              cartData.total - cartData.final_total
                            ).toLocaleString()}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <th className="border-0 px-0 pt-0">運費</th>
                        <td className="text-end border-0 px-0 pt-0">
                          {cartData.final_total >= 1000 ? "免運" : "NT$100"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-between mt-4">
                    <p className="h4 fw-bold">總計</p>
                    <p className="h4 fw-bold">
                      NT$
                      {(cartData.final_total >= 1000
                        ? cartData.final_total
                        : cartData.final_total + 100
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* 右側：聯絡與送貨資料表單 */}
                <div className="checkout-containercontentbox2text">
                  <h3 className="checkout-containercontentbox2title">
                    送貨資訊
                  </h3>
                  <form id="checkoutForm" onSubmit={onSubmit}>
                    <div className="checkout-vertical-group checkout-input-container">
                      <label htmlFor="email">
                        電子郵件 <span className="text-danger">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={`checkout-inputbox ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        placeholder="請輸入E-mail"
                        {...register("email", {
                          required: "Email 為必填",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Email 格式不正確",
                          },
                        })}
                      />
                      {errors.email && (
                        <span className="text-danger mt-1">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                    <div className="checkout-vertical-group checkout-input-container">
                      <label htmlFor="name">
                        姓名 <span className="text-danger">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        className={`checkout-inputbox ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        placeholder="請輸入真實姓名"
                        {...register("name", { required: "姓名為必填" })}
                      />
                      {errors.name && (
                        <span className="text-danger mt-1">
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                    <div className="checkout-vertical-group checkout-input-container">
                      <label htmlFor="phone">
                        電話 <span className="text-danger">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className={`checkout-inputbox ${
                          errors.phone ? "is-invalid" : ""
                        }`}
                        placeholder="請輸入手機號碼"
                        {...register("phone", {
                          required: "電話為必填",
                          pattern: {
                            value: /^09\d{8}$/,
                            message: "請輸入有效的手機號碼（如：0912345678）",
                          },
                        })}
                      />
                      {errors.phone && (
                        <span className="text-danger mt-1">
                          {errors.phone.message}
                        </span>
                      )}
                    </div>
                    <div className="checkout-vertical-group checkout-input-container">
                      <label htmlFor="address">
                        地址 <span className="text-danger">*</span>
                      </label>
                      <input
                        id="address"
                        type="text"
                        className={`checkout-inputbox ${
                          errors.address ? "is-invalid" : ""
                        }`}
                        placeholder="請輸入完整收件地址"
                        {...register("address", { required: "地址為必填" })}
                      />
                      {errors.address && (
                        <span className="text-danger mt-1">
                          {errors.address.message}
                        </span>
                      )}
                    </div>
                    <div className="checkout-vertical-group checkout-input-container">
                      <label htmlFor="message">備註</label>
                      <textarea
                        id="message"
                        className="checkout-inputbox"
                        rows="3"
                        placeholder="請輸入備註..."
                        {...register("message")}
                      ></textarea>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 提交按鈕 */}
            {!isCartEmpty && (
              <div className="d-flex justify-content-between mt-4">
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleBackToCart}
                >
                  返回購物車
                </button>
                <button
                  className="checkout-submit-button"
                  type="submit"
                  form="checkoutForm"
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      處理中...
                    </>
                  ) : (
                    "下一步，前往付款"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Checkout;
