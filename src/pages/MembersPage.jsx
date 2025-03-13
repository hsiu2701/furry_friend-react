import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function Members() {
  // 狀態管理
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // 根據年月取得該月份天數
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // 處理年份變更
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  // 處理月份變更
  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  // react-hook-form 相關設定
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // 獲取會員資料
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // 未登入的處理邏輯
          setIsLoading(false);
          return;
        }

        const res = await axios.get(`${BASE_URL}/api/${API_PATH}/member`, {
          headers: {
            Authorization: token,
          },
        });

        if (res.data.success) {
          // 格式化生日資料以便表單顯示
          const birthDate = new Date(res.data.member.birth || new Date());
          const birthYear = birthDate.getFullYear();
          const birthMonth = birthDate.getMonth() + 1;
          const birthDay = birthDate.getDate();

          // 設置年月的狀態
          setSelectedYear(birthYear);
          setSelectedMonth(birthMonth);

          reset({
            ...res.data.member,
            birthYear,
            birthMonth,
            birthDay,
            shippingName: res.data.member.shippingName || "",
            shippingPhone: res.data.member.shippingPhone || "",
            shippingAddress: res.data.member.shippingAddress || "",
          });
        }
      } catch (error) {
        console.error("獲取會員資料失敗：", error);
        setError(
          error.response?.data?.message || "獲取會員資料失敗，請稍後再試"
        );
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [reset]);

  // 表單提交
  const onSubmit = handleSubmit(async (data) => {
    setSubmitLoading(true);
    try {
      // 處理生日格式
      const birthDate = new Date(
        data.birthYear,
        data.birthMonth - 1,
        data.birthDay
      );

      // 準備提交的資料
      const submitData = {
        ...data,
        birth: birthDate.toISOString(),
      };

      // 移除不需要的欄位
      delete submitData.birthYear;
      delete submitData.birthMonth;
      delete submitData.birthDay;
      delete submitData.confirmPassword;

      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${BASE_URL}/api/${API_PATH}/member`,
        submitData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (res.data.success) {
        console.log("會員資料更新成功：", res.data);
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (error) {
      console.error("更新會員資料失敗：", error);
      setError(error.response?.data?.message || "更新會員資料失敗，請稍後再試");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSubmitLoading(false);
    }
  });

  if (isLoading) {
    return <div className="text-center py-5">載入中...</div>;
  }

  return (
    <>
      {/* banner */}
      <section className="banner">
        <div className="bannerImg">
          <div className="bannerText">會員中心</div>
        </div>

        <div className="container">
          <div className="containerbanner">
            <div className="containerbannertext">會員中心</div>
            <div className="containerbannertext">訂單資訊</div>
            <div className="containerbannertext">追蹤清單</div>
          </div>
          <div className="containercontentbox">
            <div className="dog"></div>
            <div className="cat"></div>

            {/* 會員管理內容框架 */}
            <div className="containercontentbox2">
              {updateSuccess && (
                <div className="alert alert-success" role="alert">
                  會員資料更新成功！
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* 會員管理 */}
              <div className="containercontentbox2text">
                <h3 className="containercontentbox2title">會員管理</h3>
                <form id="userForm" onSubmit={onSubmit}>
                  {/* 姓名 */}
                  <div className="vertical-group input-container">
                    <label>姓名</label>
                    <input
                      id="name"
                      className="inputbox"
                      type="text"
                      placeholder="請輸入姓名"
                      {...register("name", { required: "必填" })}
                    />
                    {errors.name && (
                      <span className="text-danger my-2 error-text">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  {/* E-mail */}
                  <div className="vertical-group input-container">
                    <label>E-mail</label>
                    <input
                      id="email"
                      className="inputbox"
                      type="email"
                      placeholder="請輸入E-mail"
                      {...register("email", {
                        required: "必填",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "email格式錯誤",
                        },
                      })}
                    />
                    {errors.email && (
                      <span className="text-danger my-2 error-text">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  {/* 手機 */}
                  <div className="vertical-group input-container">
                    <label>手機</label>
                    <input
                      id="phone"
                      className="inputbox"
                      type="tel"
                      placeholder="請輸入手機"
                      {...register("phone", {
                        required: "必填",
                        pattern: {
                          value: /^09\d{8}$/,
                          message: "請輸入有效的台灣手機號碼",
                        },
                      })}
                    />
                    {errors.phone && (
                      <span className="text-danger my-2 error-text">
                        {errors.phone.message}
                      </span>
                    )}
                  </div>
                  {/* 性別 */}
                  <div className="vertical-group input-container">
                    <label>性別</label>
                    <div className="radio-group">
                      <label>男</label>
                      <input
                        id="gender"
                        className="inputbox"
                        type="radio"
                        name="gender"
                        value="male"
                        {...register("gender", { required: "必填" })}
                      />
                      <label>女</label>
                      <input
                        id="lady"
                        className="inputbox"
                        type="radio"
                        name="gender"
                        value="female"
                        {...register("gender", { required: "必填" })}
                      />
                    </div>
                    {errors.gender && (
                      <span className="text-danger my-2 error-text">
                        {errors.gender.message}
                      </span>
                    )}
                  </div>
                  {/* 出生年月日 */}
                  <div className="vertical-group input-container">
                    <label>出生年月日</label>
                    <div className="horizontal-group">
                      <select
                        className="inputbox"
                        {...register("birthYear", { required: "必填" })}
                        onChange={handleYearChange}
                      >
                        {Array.from({ length: 2025 - 1911 + 1 }, (_, i) => {
                          const year = 1911 + i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                      <label>年</label>
                      <select
                        className="inputbox"
                        {...register("birthMonth", { required: "必填" })}
                        onChange={handleMonthChange}
                      >
                        {Array.from({ length: 12 }, (_, i) => {
                          const month = i + 1;
                          return (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          );
                        })}
                      </select>
                      <label>月</label>
                      <select
                        className="inputbox"
                        {...register("birthDay", { required: "必填" })}
                      >
                        {Array.from(
                          {
                            length: getDaysInMonth(selectedYear, selectedMonth),
                          },
                          (_, i) => {
                            const day = i + 1;
                            return (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            );
                          }
                        )}
                      </select>
                      <label>日</label>
                    </div>
                    {(errors.birthYear ||
                      errors.birthMonth ||
                      errors.birthDay) && (
                      <span className="text-danger my-2 error-text">
                        出生年月日必填
                      </span>
                    )}
                  </div>
                  {/* 密碼 */}
                  <div className="vertical-group input-container">
                    <label>密碼</label>
                    <input
                      id="password"
                      className="inputbox"
                      type="password"
                      placeholder="請輸入密碼"
                      {...register("password", {
                        required: "必填",
                        minLength: {
                          value: 8,
                          message: "密碼長度至少為8個字符",
                        },
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                          message:
                            "密碼必須包含至少一個大寫字母、一個小寫字母和一個數字",
                        },
                      })}
                    />
                    {errors.password && (
                      <span className="text-danger my-2 error-text">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                  {/* 確認密碼 */}
                  <div className="vertical-group input-container">
                    <label>確認密碼</label>
                    <input
                      id="confirmPassword"
                      className="inputbox"
                      type="password"
                      placeholder="請再次輸入密碼"
                      {...register("confirmPassword", {
                        required: "必填",
                        validate: (value) =>
                          value === watch("password") || "密碼不匹配",
                      })}
                    />
                    {errors.confirmPassword && (
                      <span className="text-danger my-2 error-text">
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* 送貨資訊 */}
              <div className="containercontentbox2text2">
                <h3 className="containercontentbox2title2">送貨資訊</h3>
                <div className="vertical-group input-container">
                  <label>姓名</label>
                  <input
                    id="shippingName"
                    className="inputbox"
                    type="text"
                    placeholder="請輸入送貨人姓名"
                    form="userForm"
                    {...register("shippingName", { required: "必填" })}
                  />
                  {errors.shippingName && (
                    <p className="text-danger my-2 error-text">
                      {errors.shippingName.message}
                    </p>
                  )}
                </div>
                <div className="vertical-group input-container">
                  <label>電話</label>
                  <input
                    id="shippingPhone"
                    className="inputbox"
                    type="tel"
                    placeholder="請輸入送貨電話"
                    form="userForm"
                    {...register("shippingPhone", {
                      required: "必填",
                      pattern: {
                        value: /^09\d{8}$/,
                        message: "請輸入有效的台灣手機號碼",
                      },
                    })}
                  />
                  {errors.shippingPhone && (
                    <p className="text-danger my-2 error-text">
                      {errors.shippingPhone.message}
                    </p>
                  )}
                </div>
                <div className="vertical-group input-container">
                  <label>聯絡地址</label>
                  <input
                    id="shippingAddress"
                    className="inputbox"
                    type="text"
                    placeholder="請輸入送貨地址"
                    form="userForm"
                    {...register("shippingAddress", { required: "必填" })}
                  />
                  {errors.shippingAddress && (
                    <p className="text-danger my-2 error-text">
                      {errors.shippingAddress.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <button
                className="submit-button"
                type="submit"
                form="userForm"
                disabled={submitLoading}
              >
                {submitLoading ? "處理中..." : "儲存變更"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Members;
