import { useState, useEffect } from "react";
import { Link } from "react-router";
import LoadingSpinner from "../assets/components/LoadingSpinner.jsx";

export default function CheckoutPayment() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    mobilePaymentMethod: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 從 sessionStorage 獲取訂單資料
  useEffect(() => {
    try {
      const storedOrderData = sessionStorage.getItem("currentOrder");

      if (!storedOrderData) {
        setError("找不到訂單資料，請返回結帳頁面重新操作");
        setLoading(false);
        return;
      }

      const parsedOrderData = JSON.parse(storedOrderData);

      // 檢查訂單是否過期（超過30分鐘）
      const orderTimestamp = parsedOrderData.timestamp || 0;
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - orderTimestamp;
      const THIRTY_MINUTES = 30 * 60 * 1000;

      if (timeDiff > THIRTY_MINUTES) {
        setError("訂單已過期，請返回結帳頁面重新操作");
        sessionStorage.removeItem("currentOrder");
        setLoading(false);
        return;
      }

      setOrderData(parsedOrderData);
      setLoading(false);
    } catch (err) {
      console.error("讀取訂單資料失敗:", err);
      setError("讀取訂單資料時發生錯誤");
      setLoading(false);
    }
  }, []);

  // 處理表單輸入變更
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // 根據不同輸入欄位簡單格式化
    if (name === "cardNumber") {
      updatedValue = value.replace(/\D/g, ""); // 移除非數字字符
      updatedValue = updatedValue.replace(/(\d{4})(?=\d)/g, "$1 "); // 每4位數字後添加空格
    } else if (name === "expiryDate") {
      updatedValue = value.replace(/\D/g, "").slice(0, 4); // 限制為4位數字
      if (updatedValue.length > 2) {
        updatedValue = updatedValue.slice(0, 2) + "/" + updatedValue.slice(2);
      }
    }

    setFormData({
      ...formData,
      [name]: updatedValue,
    });

    // 清除該欄位的錯誤
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  // 處理付款方式變更
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setFormErrors({});
  };

  // 驗證表單
  const validateForm = () => {
    const errors = {};

    if (paymentMethod === "credit") {
      if (!formData.cardNumber || formData.cardNumber.trim() === "") {
        errors.cardNumber = "請輸入信用卡號";
      }

      if (!formData.expiryDate || formData.expiryDate.trim() === "") {
        errors.expiryDate = "請輸入到期日";
      }

      if (!formData.cvc || formData.cvc.trim() === "") {
        errors.cvc = "請輸入安全碼";
      }
    } else if (paymentMethod === "mobile" && !formData.mobilePaymentMethod) {
      errors.mobilePaymentMethod = "請選擇一種行動支付方式";
    }

    return errors;
  };

  // 處理付款提交
  const handlePaymentSubmit = (e) => {
    // 表單檢查
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      e.preventDefault();
      setFormErrors(validationErrors);
      alert("請填寫所有必填欄位");
      return;
    }

    // 保存付款信息到sessionStorage
    const paymentInfo = {
      payment_method: paymentMethod,
      payment_status: "已付款", // 模擬支付成功
      payment_date: new Date().toISOString(),
    };

    // 更新sessionStorage中的訂單資訊
    const updatedOrderData = {
      ...orderData,
      payment: paymentInfo,
    };

    sessionStorage.setItem("currentOrder", JSON.stringify(updatedOrderData));

    // 清除購物車數據，但保留currentOrder以供結帳成功頁面使用
    localStorage.removeItem("cartItems");
    setIsSubmitting(true);
  };

  if (loading) {
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
    <section className="checkout-payment-banner">
      {/* Banner */}
      <div
        className="checkout-payment-bannerImg"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1415369629372-26f2fe60c467?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="checkout-payment-bannerText">付款資訊</div>
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div
          className="alert alert-danger mx-auto mt-3 text-center"
          style={{ maxWidth: "900px" }}
        >
          {error}
          {error.includes("返回結帳頁面") && (
            <a href="#/checkout" className="btn btn-outline-danger btn-sm ms-3">
              返回結帳頁面
            </a>
          )}
        </div>
      )}

      <div className="checkout-payment-container">
        {/* 步驟列表 */}
        <div className="checkout-payment-containerbanner">
          <ul className="checkout-payment-step-list">
            <li className="checkout-payment-step-item active">
              <div className="checkout-payment-step-circle active">1</div>
              <span className="checkout-payment-step-text">確認資訊</span>
            </li>
            <li className="checkout-payment-step-item active">
              <div className="checkout-payment-step-circle active">2</div>
              <span className="checkout-payment-step-text">付款方式</span>
            </li>
            <li className="checkout-payment-step-item">
              <div className="checkout-payment-step-circle">3</div>
              <span className="checkout-payment-step-text">完成訂購</span>
            </li>
          </ul>
        </div>

        {/* 主要內容區塊 */}
        <div className="checkout-payment-containercontentbox">
          <div className="checkout-payment-dog"></div>
          <div className="checkout-payment-cat"></div>

          {orderData && (
            <div className="checkout-payment-containercontentbox2">
              {/* 訂單摘要 */}
              <div className="checkout-payment-containercontentbox2text2">
                <h3 className="checkout-payment-containercontentbox2title2">
                  訂單摘要
                </h3>
                <div className="mb-4 p-3 bg-light rounded">
                  <div className="row mb-2">
                    <div className="col-4 text-muted">收件人:</div>
                    <div className="col-8">
                      {orderData.orderData?.user?.name}
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-4 text-muted">電子郵件:</div>
                    <div className="col-8">
                      {orderData.orderData?.user?.email}
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-4 text-muted">電話:</div>
                    <div className="col-8">
                      {orderData.orderData?.user?.tel}
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-4 text-muted">地址:</div>
                    <div className="col-8">
                      {orderData.orderData?.user?.address}
                    </div>
                  </div>
                  {orderData.orderData?.message && (
                    <div className="row mb-2">
                      <div className="col-4 text-muted">備註:</div>
                      <div className="col-8">{orderData.orderData.message}</div>
                    </div>
                  )}
                </div>

                <table className="table mt-4 border-top border-bottom text-muted">
                  <tbody>
                    <tr>
                      <th className="border-0 px-0 pt-4">小計</th>
                      <td className="text-end border-0 px-0 pt-4">
                        NT$ {orderData.total?.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <th className="border-0 px-0 pt-0">運費</th>
                      <td className="text-end border-0 px-0 pt-0">
                        {orderData.total >= 1000 ? "免運" : "NT$ 100"}
                      </td>
                    </tr>
                    <tr>
                      <th className="border-0 px-0 pt-0 pb-4">付款方式</th>
                      <td className="text-end border-0 px-0 pt-0 pb-4">
                        {paymentMethod === "credit" ? "信用卡付款" : "行動支付"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="d-flex justify-content-between mt-4">
                  <p className="h4 fw-bold">總計</p>
                  <p className="h4 fw-bold">
                    NT${" "}
                    {(orderData.total >= 1000
                      ? orderData.total
                      : orderData.total + 100
                    )?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* 付款資訊表單 */}
              <div className="checkout-payment-containercontentbox2text">
                <h3 className="checkout-payment-containercontentbox2title">
                  選擇付款方式
                </h3>
                <form>
                  {/* 信用卡付款選項 */}
                  <div className="card mb-3 border rounded">
                    <div
                      className="card-header bg-white"
                      onClick={() => handlePaymentMethodChange("credit")}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          id="creditCard"
                          checked={paymentMethod === "credit"}
                          onChange={() => handlePaymentMethodChange("credit")}
                          className="me-2"
                        />
                        <label
                          htmlFor="creditCard"
                          className="form-check-label mb-0 w-100"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <span>信用卡付款</span>
                            <div>
                              <i className="bi bi-credit-card me-2"></i>
                              <i className="bi bi-chevron-down"></i>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    {paymentMethod === "credit" && (
                      <div className="card-body border-top">
                        <div className="checkout-payment-vertical-group checkout-payment-input-container">
                          <label htmlFor="cardNumber">
                            卡號 <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className={`checkout-payment-inputbox ${
                              formErrors.cardNumber ? "is-invalid" : ""
                            }`}
                            placeholder="請輸入信用卡號"
                          />
                          {formErrors.cardNumber && (
                            <div className="invalid-feedback d-block">
                              {formErrors.cardNumber}
                            </div>
                          )}
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="checkout-payment-vertical-group checkout-payment-input-container">
                              <label htmlFor="expiryDate">
                                有效期限 <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                className={`checkout-payment-inputbox ${
                                  formErrors.expiryDate ? "is-invalid" : ""
                                }`}
                                placeholder="MM/YY"
                              />
                              {formErrors.expiryDate && (
                                <div className="invalid-feedback d-block">
                                  {formErrors.expiryDate}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="checkout-payment-vertical-group checkout-payment-input-container">
                              <label htmlFor="cvc">
                                安全碼 <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                id="cvc"
                                name="cvc"
                                value={formData.cvc}
                                onChange={handleInputChange}
                                className={`checkout-payment-inputbox ${
                                  formErrors.cvc ? "is-invalid" : ""
                                }`}
                                placeholder="CVC"
                              />
                              {formErrors.cvc && (
                                <div className="invalid-feedback d-block">
                                  {formErrors.cvc}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 small text-muted">
                          <i className="bi bi-shield-lock"></i>{" "}
                          您的付款資訊將經過加密保護
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 行動支付選項 */}
                  <div className="card border rounded">
                    <div
                      className="card-header bg-white"
                      onClick={() => handlePaymentMethodChange("mobile")}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          id="mobilePay"
                          checked={paymentMethod === "mobile"}
                          onChange={() => handlePaymentMethodChange("mobile")}
                          className="me-2"
                        />
                        <label
                          htmlFor="mobilePay"
                          className="form-check-label mb-0 w-100"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <span>行動支付</span>
                            <div>
                              <i className="bi bi-phone me-2"></i>
                              <i className="bi bi-chevron-down"></i>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    {paymentMethod === "mobile" && (
                      <div className="card-body border-top">
                        <div className="checkout-payment-vertical-group">
                          <p>
                            請選擇行動支付方式{" "}
                            <span className="text-danger">*</span>
                          </p>
                          <div className="d-flex flex-column gap-2 mobile-payment-options">
                            <div className="form-check bg-light p-3 rounded">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="mobilePaymentMethod"
                                id="applePay"
                                value="applePay"
                                checked={
                                  formData.mobilePaymentMethod === "applePay"
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    mobilePaymentMethod: e.target.value,
                                  })
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="applePay"
                              >
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-apple me-2"></i> Apple Pay
                                </div>
                              </label>
                            </div>
                            <div className="form-check bg-light p-3 rounded">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="mobilePaymentMethod"
                                id="googlePay"
                                value="googlePay"
                                checked={
                                  formData.mobilePaymentMethod === "googlePay"
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    mobilePaymentMethod: e.target.value,
                                  })
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="googlePay"
                              >
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-google me-2"></i> Google
                                  Pay
                                </div>
                              </label>
                            </div>
                            <div className="form-check bg-light p-3 rounded">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="mobilePaymentMethod"
                                id="linePay"
                                value="linePay"
                                checked={
                                  formData.mobilePaymentMethod === "linePay"
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    mobilePaymentMethod: e.target.value,
                                  })
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="linePay"
                              >
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-line me-2"></i> Line Pay
                                </div>
                              </label>
                            </div>
                          </div>
                          {formErrors.mobilePaymentMethod && (
                            <div className="text-danger mt-2">
                              {formErrors.mobilePaymentMethod}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 操作按鈕 */}
          {orderData && (
            <div className="checkout-payment-button-container">
              {/* 返回按鈕 */}
              <Link to="/checkout-form" className="btn-brand outline">
                <i className="bi bi-arrow-left me-2"></i>
                返回填寫資料
              </Link>

              {/* 確認付款按鈕 */}
              <Link
                to="/checkout-success"
                className="btn-brand solid"
                onClick={(e) => {
                  const validationErrors = validateForm();
                  if (Object.keys(validationErrors).length > 0) {
                    e.preventDefault();
                    setFormErrors(validationErrors);
                    alert("請填寫所有必填欄位");
                  } else {
                    window.scrollTo({ top: 0, behavior: "auto" });
                    handlePaymentSubmit(e);
                  }
                }}
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
                  <>
                    <i className="bi bi-credit-card me-2"></i>
                    確認付款
                  </>
                )}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
