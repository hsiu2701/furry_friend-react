import { useState } from "react";

function ProductPage() {
  const [qtySelect, setQtySelect] = useState(1);

  return (
    <div>
      {/* 商品路徑 */}
      <nav className="nav text-white text-center">
        <ol className="breadcrumb mb-0 w-100" aria-label="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#" className="text-white">
              全部商品
            </a>
          </li>
          <li className="breadcrumb-item">
            <a href="#" className="text-white">
              胸背牽繩
            </a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            胸背帶
          </li>
        </ol>
      </nav>

      {/* 商品主要資訊 */}
      <div className="container mt-9">
        <div className="row gx-0 align-items-stretch justify-content-center">
          {/* 左側：商品圖片 */}
          <div className="col-md-6 col-12 p-0 img-container d-flex justify-content-center align-items-center">
            <img
              src={product.imageUrl}
              alt="Product"
              className="main-img d-block mx-auto"
            />
          </div>

          {/* 右側：商品資訊 */}
          <div className="col-md-6 col-12 product-info d-flex flex-column justify-content-center">
            <h4 className="product-title">{product.title}</h4>
            <h4 className="product-price mt-4">
              {product.price !== product.origin_price ? (
                <>
                  <span className="product-origin-price">
                    NT$ {product.origin_price.toLocaleString()}
                  </span>
                  <span className="product-sale-price">
                    NT$ {product.price.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="product-sale-price">
                  NT$ {product.origin_price.toLocaleString()}
                </span>
              )}
            </h4>

            {/* 商品數量 */}
            <div className="quantity-container mt-4">
              <div className="d-flex align-items-center">
                <button
                  onClick={() => setQtySelect((prev) => Math.max(1, prev - 1))}
                  disabled={qtySelect === 1}
                  type="button"
                  className="btn btn-outline-gray btn-quantity"
                >
                  -
                </button>
                <input
                  type="text"
                  className="quantity-input bg-white text-black mx-2"
                  value={qtySelect}
                  readOnly
                />
                <button
                  onClick={() => setQtySelect(qtySelect + 1)}
                  type="button"
                  className="btn btn-outline-gray btn-quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* 按鈕 */}
            <div className="product-actions mt-4">
              <button type="button" className="btn btn-add-to-cart w-100 py-2">
                加入購物車
              </button>
              <button
                onClick={() => toggleFavoritesProductItem(product.id)}
                type="button"
                className="btn text-gray-01 w-100 mt-2 py-2"
              >
                <i
                  className={`bi ${
                    FavoritesProduct[product.id] ? "bi-heart-fill" : "bi-heart"
                  }`}
                ></i>
                追蹤清單
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 商品詳情 */}
      <div className="container mt-9">
        <div className="about-product text-gray-01">
          <h4 className="text-center mb-5 bg-brand-03">商品資訊</h4>
          <p>{product.content}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
