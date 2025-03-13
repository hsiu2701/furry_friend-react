import { useState, useEffect } from "react";
// 移除 Link 的導入
// import { Link } from "react-router-dom";
import LoadingSpinner from "../assets/components/LoadingSpinner.jsx";

export default function CheckoutSuccess() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 從 sessionStorage 獲取訂單資料
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

      // 成功展示訂單後清除暫存的結帳資訊
      // 保留一段時間後再清除，以防用戶重新整理頁面
      setTimeout(() => {
        localStorage.removeItem("checkoutInfo");
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
    <>
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
          <div className="checkout-bannerText">
            {error ? "訂單失敗" : "訂單完成"}
          </div>
        </div>

        {error && (
          <div
            className="alert alert-danger mx-auto mt-3 text-center"
            style={{ maxWidth: "900px" }}
          >
            {error}
            {error.includes("付款頁面") && (
              <a
                href="#/checkout-payment"
                className="btn btn-outline-danger btn-sm ms-3"
              >
                返回付款頁面
              </a>
            )}
          </div>
        )}

        <div className="checkout-container">
          {/* 步驟列表 */}
          <div className="checkout-containerbanner">
            <ul className="checkout-step-list">
              <li className="checkout-step-item active">
                <div className="checkout-step-circle active">
                  <i className="fas fa-check checkout-step-check"></i>
                </div>
                <span className="checkout-step-text">確認資訊</span>
              </li>
              <li className="checkout-step-item active">
                <div className="checkout-step-circle active">
                  <i className="fas fa-check checkout-step-check"></i>
                </div>
                <span className="checkout-step-text">付款方式</span>
              </li>
              <li className="checkout-step-item active">
                <div className="checkout-step-circle active">
                  <i className="fas fa-check checkout-step-check"></i>
                </div>
                <span className="checkout-step-text">完成訂購</span>
              </li>
            </ul>
          </div>

          <div className="checkout-containercontentbox">
            {orderData && (
              <>
                {/* 訂單成功訊息 */}
                <div className="text-center my-4">
                  <div
                    className="bg-success text-white p-3 rounded-circle d-inline-flex justify-content-center align-items-center mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="fas fa-check fa-3x"></i>
                  </div>
                  <h2 className="mt-3">您的訂單已完成！</h2>
                  <p className="text-muted">
                    感謝您的購買，我們將盡快為您處理訂單。
                  </p>
                  <p>
                    <strong>訂單編號：</strong>
                    <span className="badge bg-secondary p-2">
                      {orderData.orderId}
                    </span>
                  </p>
                  <p>
                    <strong>訂單日期：</strong>{" "}
                    {formatDate(orderData.payment?.payment_date)}
                  </p>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="card mb-4">
                      <div className="card-header bg-light">
                        <h4 className="mb-0">訂單摘要</h4>
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                          <span>付款方式：</span>
                          <span>
                            {orderData.payment?.payment_method === "credit"
                              ? "信用卡付款"
                              : "行動支付"}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>付款狀態：</span>
                          <span className="text-success">
                            <i className="fas fa-check-circle me-1"></i>
                            {orderData.payment?.payment_status || "已付款"}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>小計：</span>
                          <span>NT$ {orderData.total?.toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>運費：</span>
                          <span>
                            {orderData.total >= 1000 ? "免運" : "NT$ 100"}
                          </span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <strong>總計：</strong>
                          <strong>
                            NT${" "}
                            {(orderData.total >= 1000
                              ? orderData.total
                              : orderData.total + 100
                            )?.toLocaleString()}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card mb-4">
                      <div className="card-header bg-light">
                        <h4 className="mb-0">收件資訊</h4>
                      </div>
                      <div className="card-body">
                        <div className="d-flex flex-column">
                          <p className="mb-2">
                            <strong>收件人：</strong>{" "}
                            {orderData.orderData?.user?.name}
                          </p>
                          <p className="mb-2">
                            <strong>Email：</strong>{" "}
                            {orderData.orderData?.user?.email}
                          </p>
                          <p className="mb-2">
                            <strong>電話：</strong>{" "}
                            {orderData.orderData?.user?.tel}
                          </p>
                          <p className="mb-2">
                            <strong>地址：</strong>{" "}
                            {orderData.orderData?.user?.address}
                          </p>
                          {orderData.orderData?.message && (
                            <p className="mb-0">
                              <strong>備註：</strong>{" "}
                              {orderData.orderData.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="alert alert-info d-flex align-items-center p-3 mt-2 mb-4">
                  <i className="fas fa-info-circle fa-lg me-3"></i>
                  <div>
                    <strong>訂單確認信已發送至您的郵箱</strong>
                    <div>
                      我們已將訂單詳情發送至 {orderData.orderData?.user?.email}
                      ，請查收。
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 操作按鈕 - 改為使用a標籤 */}
            <div
              className="checkout-buttons"
              style={{ margin: "30px 30px", display: "flex", gap: "30px" }}
            >
              <a
                href="#/profile/orders"
                className="btn btn-outline-secondary btn-lg"
              >
                <i className="fas fa-list-alt"></i>
                查看我的訂單
              </a>
              <a
                href="#/"
                className="btn btn-primary btn-lg"
                onClick={clearCheckoutData}
              >
                <i className="fas fa-home"></i>
                返回首頁
              </a>
              <a
                href="#/products"
                className="btn btn-success btn-lg"
                onClick={clearCheckoutData}
              >
                <i className="fas fa-shopping-cart"></i>
                繼續購物
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
