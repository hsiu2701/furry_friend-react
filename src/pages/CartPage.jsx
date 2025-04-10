import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { updateCartData } from "../redux/cartSlices";
// API 設定
const BASE_URL = import.meta.env.VITE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage() {
  // 狀態管理
  const [cart, setCart] = useState({});
  const [, setIsScreenLoading] = useState(false);
  const dispatch = useDispatch();

  // 取得購物車資料
  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCart(res.data.data);
      dispatch(updateCartData(res.data.data));
    } catch {
      alert("取得購物車列表失敗");
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  // 移除整個購物車
  const removeCart = async () => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      getCart();
      alert("刪除購物車成功");
    } catch {
      alert("刪除購物車失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 移除單個購物車項目
  const removeCartItem = async (cartItemId) => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItemId}`);
      getCart();
    } catch {
      alert("刪除購物車品項失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 更新購物車項目數量
  const updateCartItem = async (cartItemId, productId, qty) => {
    if (qty < 1) return;
    setIsScreenLoading(true);
    try {
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItemId}`, {
        data: {
          product_id: productId,
          qty: Number(qty),
        },
      });
      getCart();
    } catch {
      alert("更新購物車品項失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 計算總數量
  const totalQuantity =
    cart?.carts?.reduce((sum, item) => sum + item.qty, 0) || 0;

  const formatCurrency = (value) =>
    typeof value === "number" ? `NT$ ${value.toLocaleString()}` : "NT$ 0";

  return (
    <div className="container-fluid cart-page">
      <div className="container">
        <div className="mt-3">
          <h3 className="mt-3 mb-4">購物車</h3>
          <div className="row">
            <div className="col-md-8">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="border-0 ps-0">
                      產品名稱
                    </th>
                    <th scope="col" className="border-0">
                      數量
                    </th>
                    <th scope="col" className="border-0">
                      價格
                    </th>
                    <th scope="col" className="border-0"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.carts?.map((cartItem) => (
                    <tr key={cartItem.id} className="border-bottom border-top">
                      <th
                        scope="row"
                        className="border-0 px-0 font-weight-normal py-4"
                      >
                        <img
                          className="cart-item-img"
                          src={cartItem.product.imageUrl}
                          alt={cartItem.product.title}
                        />
                        <p className="mb-0 fw-bold ms-3 d-inline-block">
                          {cartItem.product.title}
                        </p>
                      </th>
                      <td className="border-0 align-middle">
                        <div className="input-group flex-nowrap quantity-group">
                          {/* 減少數量 */}
                          <button
                            onClick={() =>
                              updateCartItem(
                                cartItem.id,
                                cartItem.product.id,
                                cartItem.qty - 1
                              )
                            }
                            className="btn p-0 border-0 shadow-none d-flex align-items-center justify-content-center"
                            type="button"
                          >
                            <i className="bi bi-dash"></i>
                          </button>

                          {/* 數量輸入框 */}
                          <input
                            type="text"
                            className="form-control text-center border-0 shadow-none text-dark p-0"
                            value={cartItem.qty}
                            readOnly
                          />

                          {/* 增加數量 */}
                          <button
                            onClick={() =>
                              updateCartItem(
                                cartItem.id,
                                cartItem.product.id,
                                cartItem.qty + 1
                              )
                            }
                            className="btn p-0 border-0 shadow-none d-flex align-items-center justify-content-center"
                            type="button"
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </td>
                      <td className="border-0 align-middle">
                        <p className="mb-0 ms-auto">
                          {formatCurrency(cartItem.final_total)}
                        </p>
                      </td>
                      <td className="border-0 align-middle">
                        <button
                          className="btn border-0"
                          onClick={() => {
                            const isConfirmed = window.confirm(
                              `確定要刪除「${cartItem.product.title}」嗎？`
                            );
                            if (isConfirmed) {
                              removeCartItem(cartItem.id);
                            }
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalQuantity > 0 && (
                <button
                  onClick={() => {
                    const isConfirmed = window.confirm(
                      "你確定要清空整個購物車嗎？此操作無法還原！"
                    );
                    if (isConfirmed) {
                      removeCart();
                    }
                  }}
                  className="btn-brand-lg outline w-100 mt-4"
                >
                  清空購物車
                </button>
              )}
            </div>
            <div className="col-md-4">
              <div className="border p-4 mb-4">
                <h4 className="fw-bold mb-4">訂單明細</h4>
                <table className="table text-muted border-bottom">
                  <tbody>
                    <tr>
                      <th
                        scope="row"
                        className="border-0 px-0 pt-4 font-weight-normal"
                      >
                        小計
                      </th>
                      <td className="text-end border-0 px-0 pt-4">
                        {formatCurrency(cart.final_total)}
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="border-0 px-0 pt-0 pb-4 font-weight-normal"
                      >
                        總數量
                      </th>
                      <td className="text-end border-0 px-0 pt-0 pb-4">
                        {totalQuantity} 件
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="d-flex justify-content-between mt-4">
                  <p className="mb-0 h4 fw-bold">總計</p>
                  <p className="mb-0 h4 fw-bold">
                    {formatCurrency(cart.final_total)}
                  </p>
                </div>
                <div className="d-flex justify-content-center mt-4 text-center">
                  <Link
                    to={totalQuantity > 0 ? "/checkout-form" : "#"}
                    className={`btn-brand-lg solid w-100 ${
                      totalQuantity === 0 ? "disabled" : ""
                    }`}
                    onClick={(e) => totalQuantity === 0 && e.preventDefault()}
                  >
                    結帳
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
