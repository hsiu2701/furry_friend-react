import { Link } from "react-router";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import LoadingSpinner from "../assets/components/LoadingSpinner.jsx";

// 更新環境變數名稱並提供預設值
const BASE_URL = import.meta.env.VITE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function Checkout() {
  const [cartData, setCartData] = useState({
    carts: [],
    total: 0,
    final_total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const tempOrderId = "temp-order-id"; // 臨時訂單ID，用於開發階段

  const {
    register,
    formState: { errors, isValid },
    watch,
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: {
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

  // 獲取購物車資料 - 更新為使用 v2 API
  useEffect(() => {
    const getCart = async () => {
      try {
        setApiError("");

        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);

        if (res.data.success) {
          setCartData(res.data.data);
        } else {
          setApiError(res.data.message || "獲取購物車失敗");
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

  // 保存當前表單內容到 sessionStorage
  const onSubmit = (data) => {
    const formData = {
      user: {
        name: data.name,
        email: data.email,
        tel: data.phone,
        address: data.address,
      },
      message: data.message || "",
    };

    sessionStorage.setItem(
      "currentOrder",
      JSON.stringify({
        orderId: tempOrderId,
        orderData: formData,
        total: cartData.final_total,
        timestamp: new Date().getTime(),
      })
    );

    // 提交成功後導航到下一頁
    window.location.href = "/checkout-payment";
  };

  // 處理表單驗證失敗
  const onError = (errors) => {
    console.error("表單驗證失敗:", errors);
    alert("請填寫所有必填欄位並確保格式正確");
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
      {/* banner 與主要內容 */}
      <section className="checkout-banner">
        <div
          className="checkout-bannerImg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1415369629372-26f2fe60c467?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
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
                <div className="checkout-step-circle active">1</div>
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
            <div className="checkout-dog"></div>
            <div className="checkout-cat"></div>

            {isCartEmpty ? (
              <div className="text-center py-5">
                <h3>您的購物車是空的</h3>
                <p className="mt-3">請先加入商品再進行結帳</p>
                <Link to="/" className="btn btn-primary mt-3">
                  開始購物
                </Link>
              </div>
            ) : (
              <div className="checkout-containercontentbox2">
                {/* 左側：訂單摘要 */}
                <div className="checkout-containercontentbox2text2">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="checkout-containercontentbox2title2">
                      購物車摘要
                    </h3>
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
                          <p>NT$ {item.final_total.toLocaleString()}</p>
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
                          NT$ {cartData.total.toLocaleString()}
                        </td>
                      </tr>
                      {cartData.final_total !== cartData.total && (
                        <tr>
                          <th className="border-0 px-0 pt-0">折扣</th>
                          <td className="text-end border-0 px-0 pt-0 text-danger">
                            -NT${" "}
                            {(
                              cartData.total - cartData.final_total
                            ).toLocaleString()}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <th className="border-0 px-0 pt-0">運費</th>
                        <td className="text-end border-0 px-0 pt-0">
                          {cartData.final_total >= 1000 ? "免運" : "NT$ 100"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-between mt-4">
                    <p className="h4 fw-bold">總計</p>
                    <p className="h4 fw-bold">
                      NT${" "}
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
                  <form
                    id="checkoutForm"
                    onSubmit={handleSubmit(onSubmit, onError)}
                  >
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
                          required: "電子郵件為必填欄位",
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
                        {...register("name", {
                          required: "姓名為必填欄位",
                        })}
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
                          required: "電話為必填欄位",
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
                        {...register("address", {
                          required: "地址為必填欄位",
                        })}
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

            {/* 提交按鈕區域 - 固定在表單下方 */}
            <div className="d-flex w-100 px-4 mb-4 justify-content-end">
              <Link to="/cart" className="btn-brand outline me-2">
                返回購物車
              </Link>

              {isValid ? (
                <Link
                  to="/checkout-payment"
                  className="btn-brand solid ms-2"
                  onClick={() => {
                    const formData = {
                      user: {
                        name: formValues.name,
                        email: formValues.email,
                        tel: formValues.phone,
                        address: formValues.address,
                      },
                      message: formValues.message || "",
                    };

                    sessionStorage.setItem(
                      "currentOrder",
                      JSON.stringify({
                        orderId: tempOrderId,
                        orderData: formData,
                        total: cartData.final_total,
                        timestamp: new Date().getTime(),
                      })
                    );
                  }}
                >
                  下一步
                </Link>
              ) : (
                <span
                  className="btn-brand solid ms-2 disabled-link"
                  aria-disabled="true"
                  title="請先填寫正確的表單資料"
                >
                  下一步
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
