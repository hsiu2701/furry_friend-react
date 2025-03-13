import React, { useState, useEffect } from "react";

const WishListProducts = ({ products = [] }) => {
  const [wishList, setWishList] = useState(() => {
    const storedWishList = localStorage.getItem("wishList");
    return storedWishList ? JSON.parse(storedWishList) : {};
  });

  useEffect(() => {
    const storedWishList = JSON.parse(localStorage.getItem("wishList")) || {};
    setWishList(storedWishList);
  }, []);

  useEffect(() => {
    const updateWishList = () => {
      const storedWishList = JSON.parse(localStorage.getItem("wishList")) || {};
      setWishList(storedWishList);
    };

    window.addEventListener("storage", updateWishList);
    return () => {
      window.removeEventListener("storage", updateWishList);
    };
  }, []);

  const wishListProducts = products.filter((product) => wishList[product.id]);

  const handleDelete = (id) => {
    const updatedWishList = { ...wishList };
    delete updatedWishList[id]; // 從收藏清單移除
    localStorage.setItem("wishList", JSON.stringify(updatedWishList));
    setWishList(updatedWishList); // 更新狀態

    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="container">
      {/* 桌面版 (`lg` 以上顯示 Table) */}
      <div className="d-none d-lg-block">
        <table className="table align-middle">
          <thead>
            <tr>
              <th scope="col">品名</th>
              <th scope="col" className="text-center">
                分類
              </th>
              <th scope="col" className="text-center">
                價格
              </th>
            </tr>
          </thead>
          <tbody>
            {wishListProducts.length > 0 ? (
              wishListProducts.map((item) => (
                <tr key={item.id}>
                  <td>
                    <a href={`/product/${item.id}`} className="product-link">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="product-image"
                      />
                      {item.title}
                    </a>
                  </td>
                  <td className="text-center">{item.category}</td>
                  <td>
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <div className="price-container">
                        {item.price !== item.origin_price ? (
                          <>
                            <span className="product-origin-price">
                              NT$ {item.origin_price.toLocaleString()}
                            </span>
                            <span className="product-sale-price">
                              NT$ {item.price.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="product-sale-price">
                            NT$ {item.origin_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        🗑️ 刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  沒有收藏的商品
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 手機 & 平板版 */}
      <div className="d-block d-lg-none">
        {wishListProducts.length > 0 ? (
          wishListProducts.map((item) => (
            <div key={item.id} className="card product-card">
              <div className="d-flex align-items-center">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="product-image"
                />
                <div className="flex-grow-1 ms-3">
                  <h5>{item.title}</h5>
                  <p>分類: {item.category}</p>
                  <p className="d-flex align-items-center justify-content-between">
                    <span className="price-container text-center">
                      {item.price !== item.origin_price ? (
                        <>
                          <span className="product-origin-price">
                            NT$ {item.origin_price.toLocaleString()}
                          </span>
                          <span className="product-sale-price">
                            NT$ {item.price.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="product-sale-price">
                          NT$ {item.origin_price.toLocaleString()}
                        </span>
                      )}
                    </span>
                    <button
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => handleDelete(item.id)}
                    >
                      🗑️
                    </button>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">沒有收藏的商品</p>
        )}
      </div>
    </div>
  );
};

export default WishListProducts;
