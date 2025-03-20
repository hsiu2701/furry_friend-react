import { useState, useEffect } from "react";
import LoadingSpinner from "../assets/components/LoadingSpinner.jsx";

export default function CheckoutSuccess() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 從 sessionStorage 獲取訂單資料並清除購物車
  useEffect(() => {
    try {
      const storedOrderData = sessionStorage.getItem("currentOrder");

      if (!storedOrderData) {
        setError("找不到訂單資料，請返回首頁重新購物");
        setLoading(false);
        return;
      }

      const parsedOrderData = JSON.parse(storedOrderData);

      // 檢查是否有付款資訊
      if (!parsedOrderData.payment) {
        setError("訂單尚未完成付款，請返回付款頁面");
        setLoading(false);
        return;
      }

      setOrderData(parsedOrderData);

      // 成功展示訂單後清除暫存的結帳資訊和購物車
      localStorage.removeItem("cartItems");

      // 保留一段時間後再清除其他結帳資訊，以防用戶重新整理頁面
      setTimeout(() => {
        localStorage.removeItem("checkoutInfo");
        sessionStorage.removeItem("currentOrder");
      }, 10000); // 10秒後清除

      setLoading(false);
    } catch (err) {
      console.error("讀取訂單資料失敗:", err);
      setError("讀取訂單資料時發生錯誤");
      setLoading(false);
    }
  }, []);

  // 清除結帳資料的函數 - 用於a標籤中的onClick
  const clearCheckoutData = () => {
    sessionStorage.removeItem("currentOrder");
    localStorage.removeItem("checkoutInfo");
    localStorage.removeItem("cartItems"); // 確保購物車也被清除
  };

  // 計算日期格式
  const formatDate = (dateString) => {
    const date = new Date(dateString || Date.now());
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
    <section className="order-success-section">
      {/* Banner */}
      <div
        className="order-success-banner"
        style={{
          backgroundImage: 'url("./banner.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="order-success-title">
          {error ? "訂單失敗" : "訂單完成"}
        </div>
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          {error.includes("付款頁面") && (
            <a href="#/checkout-payment" className="error-link">
              返回付款頁面
            </a>
          )}
        </div>
      )}

      <div className="order-success-container">
        {/* 步驟列表 */}
        <div className="progress-steps">
          <ul className="step-list">
            <li className="step-item active">
              <div className="step-circle">
                <i className="fas fa-check"></i>
              </div>
              <span className="step-text">確認資訊</span>
            </li>
            <li className="step-item active">
              <div className="step-circle">
                <i className="fas fa-check"></i>
              </div>
              <span className="step-text">付款方式</span>
            </li>
            <li className="step-item active">
              <div className="step-circle">
                <i className="fas fa-check"></i>
              </div>
              <span className="step-text">完成訂購</span>
            </li>
          </ul>
        </div>

        {/* 主要內容區塊 */}
        {orderData && (
          <div className="order-success-content">
            {/* 訂單完成標題 */}
            <div className="success-header">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h1 className="success-title">您的訂單已完成！</h1>
              <p className="success-message">
                感謝您的購買，我們將盡快為您處理訂單。
              </p>
              <div className="order-info">
                <div className="order-number">
                  <span className="label">訂單編號：</span>
                  <span className="order-id">{orderData.orderId}</span>
                </div>
                <div className="order-date">
                  <span className="label">訂單日期：</span>
                  <span className="date">
                    {formatDate(orderData.payment?.payment_date)}
                  </span>
                </div>
              </div>
            </div>

            {/* 訂單摘要和收件信息 */}
            <div className="order-details">
              {/* 左側：訂單摘要 */}
              <div className="order-summary">
                <h2 className="section-title">訂單摘要</h2>
                <div className="summary-content">
                  <div className="summary-row">
                    <span className="label">付款方式</span>
                    <span className="value">
                      {orderData.payment?.payment_method === "credit"
                        ? "信用卡付款"
                        : "行動支付"}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="label">付款狀態</span>
                    <span className="value status-success">
                      <i className="fas fa-check-circle"></i>
                      {orderData.payment?.payment_status || "已付款"}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="label">小計</span>
                    <span className="value">
                      NT$ {orderData.total?.toLocaleString()}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="label">運費</span>
                    <span className="value">
                      {orderData.total >= 1000 ? "免運" : "NT$ 100"}
                    </span>
                  </div>
                  <div className="summary-row total">
                    <span className="label">總計</span>
                    <span className="value">
                      NT${" "}
                      {(orderData.total >= 1000
                        ? orderData.total
                        : orderData.total + 100
                      )?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 右側：收件資訊 */}
              <div className="shipping-info">
                <h2 className="section-title">收件資訊</h2>
                <div className="info-content">
                  <div className="info-row">
                    <span className="label">收件人</span>
                    <span className="value">
                      {orderData.orderData?.user?.name}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Email</span>
                    <span className="value">
                      {orderData.orderData?.user?.email}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">電話</span>
                    <span className="value">
                      {orderData.orderData?.user?.tel}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">地址</span>
                    <span className="value">
                      {orderData.orderData?.user?.address}
                    </span>
                  </div>
                  {orderData.orderData?.message && (
                    <div className="info-row">
                      <span className="label">備註</span>
                      <span className="value">
                        {orderData.orderData.message}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 訂單確認信息 */}
            <div className="email-notification">
              <div className="notification-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="notification-content">
                <h3 className="notification-title">
                  訂單確認信已發送至您的郵箱
                </h3>
                <p className="notification-message">
                  我們已將訂單詳情發送至
                  <span className="email">
                    {orderData.orderData?.user?.email}
                  </span>
                  ，請查收。
                </p>
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="action-buttons">
              <a
                href="/my-orders"
                className="btnbottom btn-outline"
                onClick={clearCheckoutData}
              >
                <i className="fas fa-list-alt"></i>
                <span>查看我的訂單</span>
              </a>
              <a
                href="/"
                className="btnbottom btn-primary"
                onClick={clearCheckoutData}
              >
                <i className="fas fa-home"></i>
                <span>返回首頁</span>
              </a>
              <a
                href="/products"
                className="btnbottom btn-success"
                onClick={clearCheckoutData}
              >
                <i className="fas fa-shopping-cart"></i>
                <span>繼續購物</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
