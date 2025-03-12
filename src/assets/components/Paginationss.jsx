function Paginationss({ pageInfo, handlePageChange }) {
  if (!pageInfo || !pageInfo.total_pages) return null;
  return (
    <>
      {/* 分頁資料 */}
      <nav className="d-flex justify-content-center">
        <ul className="pagination">
          {/* 上一頁按鈕 */}
          <li className={`page-item ${!pageInfo.has_pre ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(pageInfo.current_page - 1)}
            >
              上一頁
            </button>
          </li>

          {/* 數字分頁 */}
          {Array.from({ length: pageInfo.total_pages }, (_, index) => (
            <li
              key={index}
              className={`page-item ${
                pageInfo.current_page === index + 1 ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}

          {/* 下一頁按鈕 */}
          <li className={`page-item ${!pageInfo.has_next ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(pageInfo.current_page + 1)}
            >
              下一頁
            </button>
          </li>
        </ul>
      </nav>

      {/* <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
           
            <li className={`page-item ${!pageInfo.has_pre && "disabled"}`}>
              <a
                onClick={() => handlePageChange(pageInfo.current_page - 1)}
                className="page-link"
                href="#"
              >
                上一頁
              </a>
            </li>
            
            {Array.from({ length: pageInfo.total_pages }).map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  pageInfo.current_page === index + 1 && "active"
                }`}
              >
               
                <a
                  onClick={() => handlePageChange(index + 1)}
                  className="page-link"
                  href="#"
                >
                  {index + 1}
                </a>
              </li>
            ))}

            <li className={`page-item ${!pageInfo.has_next && "disabled"}`}>
              <a
                onClick={() => handlePageChange(pageInfo.current_page + 1)}
                className="page-link"
                href="#"
              >
                下一頁
              </a>
            </li>
          </ul>
        </nav>
      </div> */}
    </>
  );
}

export default Paginationss;
