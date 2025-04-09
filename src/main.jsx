// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import routes from "./routes/index.jsx";
// import "./index.css";
import "./assets/all.scss";
// 要自訂JS ,先關掉"bootstrap"
import "bootstrap";
import "./assets/layout.scss";
import "./assets/home.scss";
import "./assets/productlist.scss";
import "./assets/banners.scss";
import "./assets/members.scss";
import "./assets/cartpage.scss";
import "./assets/checkoutform.scss";
import "./assets/checkoutpayment.scss";
import "./assets/checkoutsuccess.scss";
import "./assets/admindashboard.scss";
import "./assets/buttons.scss";
const router = createHashRouter(routes);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>{/* <App /> */}</RouterProvider>
);
