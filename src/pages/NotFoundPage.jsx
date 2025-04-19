import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="fw-bold mb-3">404 - 找不到頁面</h1>
        <p className="text-muted mb-4">
          您所查詢的頁面不存在，3 秒後將自動返回首頁。
        </p>
        <button onClick={() => navigate("/")} className="btn btn-outline">
          馬上回首頁
        </button>
      </div>
    </div>
  );
}
