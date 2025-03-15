import { useState, useEffect } from "react";
// 移除 Link 的導入，在必要時使用 a 標籤
// import { Link } from "react-router-dom";
import LoadingSpinner from "../assets/components/LoadingSpinner.jsx";
import { Link } from "react-router";

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
  // 處理表單輸入變更的簡化版本
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 簡化表單資料處理，保留基本格式化功能
    let updatedValue = value;

    // 根據不同輸入欄位簡單格式化
    if (name === "cardNumber") {
      // 保留空格格式化，但允許更短的卡號
      updatedValue = value.replace(/\D/g, ""); // 移除非數字字符
      updatedValue = updatedValue.replace(/(\d{4})(?=\d)/g, "$1 "); // 每4位數字後添加空格
    } else if (name === "expiryDate") {
      // 簡化有效期格式化，保留斜線分隔
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
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   // 表單資料驗證與格式化
  //   let updatedValue = value;

  //   // 根據不同輸入欄位格式化
  //   if (name === "cardNumber") {
  //     // 移除非數字字符並限制為16位
  //     updatedValue = value.replace(/\D/g, "").slice(0, 16);
  //     // 每4位數字後添加空格 (除了最後一組)
  //     updatedValue = updatedValue.replace(/(\d{4})(?=\d)/g, "$1 ");
  //   } else if (name === "expiryDate") {
  //     // 移除非數字字符並限制為4位
  //     updatedValue = value.replace(/\D/g, "").slice(0, 4);
  //     // 在前兩位數字後添加斜線
  //     if (updatedValue.length > 2) {
  //       updatedValue = updatedValue.slice(0, 2) + "/" + updatedValue.slice(2);
  //     }
  //   } else if (name === "cvc") {
  //     // 移除非數字字符並限制為3位
  //     updatedValue = value.replace(/\D/g, "").slice(0, 3);
  //   }

  //   setFormData({
  //     ...formData,
  //     [name]: updatedValue,
  //   });

  //   // 清除該欄位的錯誤
  //   if (formErrors[name]) {
  //     setFormErrors({
  //       ...formErrors,
  //       [name]: null,
  //     });
  //   }
  // };

  // 處理付款方式變更
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    // 切換付款方式時重置表單錯誤
    setFormErrors({});
  };

  // 驗證表單
  // 簡化的表單驗證函數
  const validateForm = () => {
    const errors = {};

    if (paymentMethod === "credit") {
      // 簡化卡號驗證：只要有輸入內容即可
      if (!formData.cardNumber || formData.cardNumber.trim() === "") {
        errors.cardNumber = "請輸入信用卡號";
      }

      // 簡化到期日驗證：只要有輸入內容即可
      if (!formData.expiryDate || formData.expiryDate.trim() === "") {
        errors.expiryDate = "請輸入到期日";
      }

      // 簡化安全碼驗證：只要有輸入內容即可
      if (!formData.cvc || formData.cvc.trim() === "") {
        errors.cvc = "請輸入安全碼";
      }
    } else if (paymentMethod === "mobile" && !formData.mobilePaymentMethod) {
      errors.mobilePaymentMethod = "請選擇一種行動支付方式";
    }

    return errors;
  };
  // const validateForm = () => {
  //   const errors = {};

  //   if (paymentMethod === "credit") {
  //     if (
  //       !formData.cardNumber ||
  //       formData.cardNumber.replace(/\s/g, "").length < 16
  //     ) {
  //       errors.cardNumber = "請輸入完整的信用卡號（16位數字）";
  //     }

  //     if (!formData.expiryDate || formData.expiryDate.length < 5) {
  //       errors.expiryDate = "請輸入有效的到期日（MM/YY）";
  //     } else {
  //       const [month, year] = formData.expiryDate.split("/");
  //       const currentDate = new Date();
  //       const currentYear = currentDate.getFullYear() % 100; // 獲取年份的後兩位
  //       const currentMonth = currentDate.getMonth() + 1; // 月份從0開始

  //       if (parseInt(month) < 1 || parseInt(month) > 12) {
  //         errors.expiryDate = "月份必須介於1到12之間";
  //       } else if (
  //         parseInt(year) < currentYear ||
  //         (parseInt(year) === currentYear && parseInt(month) < currentMonth)
  //       ) {
  //         errors.expiryDate = "卡片已過期";
  //       }
  //     }

  //     if (!formData.cvc || formData.cvc.length < 3) {
  //       errors.cvc = "請輸入完整的安全碼（3位數字）";
  //     }
  //   } else if (paymentMethod === "mobile" && !formData.mobilePaymentMethod) {
  //     errors.mobilePaymentMethod = "請選擇一種行動支付方式";
  //   }

  //   return errors;
  // };

  // 保存付款資訊到 sessionStorage

  // eslint-disable-next-line no-unused-vars
  const savePaymentInfoToSessionStorage = () => {
    if (!orderData || !orderData.orderId) {
      setError("訂單資料無效，請返回結帳頁面重新操作");
      return false;
    }

    // 驗證表單
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return false;
    }

    // 將付款信息添加到訂單數據中
    const paymentInfo = {
      payment_method: paymentMethod,
      payment_status: "已付款", // 模擬支付成功
      payment_date: new Date().toISOString(),
    };

    // 更新 sessionStorage 中的訂單資訊
    const updatedOrderData = {
      ...orderData,
      payment: paymentInfo,
    };

    sessionStorage.setItem("currentOrder", JSON.stringify(updatedOrderData));
    return true;
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
    <>
      {/* banner 與主要內容 */}
      <section className="checkout-payment-banner">
        <div
          className="checkout-payment-bannerImg"
          style={{
            backgroundImage: 'url("./banner.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="checkout-payment-bannerText">付款資訊</div>
        </div>

        {error && (
          <div
            className="alert alert-danger mx-auto mt-3 text-center"
            style={{ maxWidth: "900px" }}
          >
            {error}
            {error.includes("返回結帳頁面") && (
              <a
                href="#/checkout"
                className="btn btn-outline-danger btn-sm ms-3"
              >
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
                <div className="checkout-payment-step-circle active">
                  <i className="fas fa-check checkout-payment-step-check"></i>
                </div>
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
                {/* 左側：訂單摘要 */}
                <div className="checkout-payment-containercontentbox2text2">
                  <h3 className="checkout-payment-containercontentbox2title2">
                    訂單摘要
                  </h3>
                  <div className="mb-4 p-3 bg-light rounded">
                    <h5 className="mb-3">訂單編號: {orderData.orderId}</h5>
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
                        <div className="col-8">
                          {orderData.orderData.message}
                        </div>
                      </div>
                    )}
                  </div>

                  <table className="table mt-4 border-top border-bottom text-muted">
                    <tbody>
                      <tr>
                        <th className="border-0 px-0 pt-4">小計</th>
                        <td className="text-end border-0 px-0 pt-4">
                          NT${orderData.total?.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <th className="border-0 px-0 pt-0">運費</th>
                        <td className="text-end border-0 px-0 pt-0">
                          {orderData.total >= 1000 ? "免運" : "NT$100"}
                        </td>
                      </tr>
                      <tr>
                        <th className="border-0 px-0 pt-0 pb-4">付款方式</th>
                        <td className="text-end border-0 px-0 pt-0 pb-4">
                          {paymentMethod === "credit"
                            ? "信用卡付款"
                            : "行動支付"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-between mt-4">
                    <p className="h4 fw-bold">總計</p>
                    <p className="h4 fw-bold">
                      NT$
                      {(orderData.total >= 1000
                        ? orderData.total
                        : orderData.total + 100
                      )?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* 右側：付款資訊表單 */}
                <div className="checkout-payment-containercontentbox2text">
                  <h3 className="checkout-payment-containercontentbox2title">
                    選擇付款方式
                  </h3>
                  <form>
                    {/* 付款方式 Accordion */}
                    <div className="accordion" id="paymentAccordion">
                      <div className="card mb-3 border rounded">
                        <div
                          className="card-header bg-white"
                          id="paymentHeadingOne"
                          onClick={() => handlePaymentMethodChange("credit")}
                          style={{ cursor: "pointer" }}
                          aria-expanded={paymentMethod === "credit"}
                          aria-controls="paymentCollapseOne"
                        >
                          <div className="d-flex align-items-center">
                            <input
                              type="radio"
                              name="paymentMethod"
                              id="creditCard"
                              checked={paymentMethod === "credit"}
                              onChange={() =>
                                handlePaymentMethodChange("credit")
                              }
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
                                    有效期限{" "}
                                    <span className="text-danger">*</span>
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
                                    安全碼{" "}
                                    <span className="text-danger">*</span>
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

                      <div className="card border rounded">
                        <div
                          className="card-header bg-white"
                          id="paymentHeadingTwo"
                          onClick={() => handlePaymentMethodChange("mobile")}
                          style={{ cursor: "pointer" }}
                          aria-expanded={paymentMethod === "mobile"}
                          aria-controls="paymentCollapseTwo"
                        >
                          <div className="d-flex align-items-center">
                            <input
                              type="radio"
                              name="paymentMethod"
                              id="mobilePay"
                              checked={paymentMethod === "mobile"}
                              onChange={() =>
                                handlePaymentMethodChange("mobile")
                              }
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
                              <div className="d-flex flex-column gap-2">
                                <div className="form-check bg-light p-3 rounded">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="mobilePaymentMethod"
                                    id="applePay"
                                    value="applePay"
                                    checked={
                                      formData.mobilePaymentMethod ===
                                      "applePay"
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
                                      <i className="bi bi-apple me-2"></i> Apple
                                      Pay
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
                                      formData.mobilePaymentMethod ===
                                      "googlePay"
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
                                      <i className="bi bi-google me-2"></i>{" "}
                                      Google Pay
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
                                      <i className="bi bi-line me-2"></i> Line
                                      Pay
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
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 操作按鈕 - 只需修改這部分 */}
            {orderData && (
              <div className="checkout-payment-button-container">
                {/* 返回按鈕 */}
                <Link
                  to="/checkout-form"
                  className="checkout-payment-back-button"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  返回填寫資料
                </Link>

                {/* 確認付款按鈕 */}
                {/* 確認付款按鈕 - 簡化版本 */}
                <Link
                  to="/checkout-success"
                  className="checkout-payment-submit-button"
                  onClick={(e) => {
                    // 簡化的表單檢查
                    const validationErrors = validateForm();

                    if (Object.keys(validationErrors).length > 0) {
                      e.preventDefault();
                      setFormErrors(validationErrors);

                      // 簡化的錯誤提示
                      if (Object.keys(validationErrors).length > 0) {
                        alert("請填寫所有必填欄位");
                      }
                    } else {
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

                      sessionStorage.setItem(
                        "currentOrder",
                        JSON.stringify(updatedOrderData)
                      );
                      setIsSubmitting(true);
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
                {/* <a
                  href="#/checkout-success"
                  className="checkout-payment-submit-button"
                  onClick={(e) => {
                    // 如果表單不符合要求，取消導航
                    if (!savePaymentInfoToSessionStorage()) {
                      e.preventDefault();

                      if (
                        paymentMethod === "credit" &&
                        (!formData.cardNumber ||
                          !formData.expiryDate ||
                          !formData.cvc)
                      ) {
                        alert("請填寫完整的信用卡資訊");
                      } else if (
                        paymentMethod === "mobile" &&
                        !formData.mobilePaymentMethod
                      ) {
                        alert("請選擇行動支付方式");
                      }
                    } else {
                      // 可以添加付款前的加載視覺提示 (可選)
                      setIsSubmitting(true);
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
                </a> */}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
