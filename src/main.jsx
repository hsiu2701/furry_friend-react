// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import routes from "./routes/index.jsx";
// import "./index.css";
import "./assets/all.scss";
// 要自訂JS ,先關掉"bootstrap"
import "bootstrap";
import "./assets/_layout.scss";
import "./assets/_home.scss";
import "./assets/_productlist.scss";
import "./assets/_banners.scss";
import "./assets/_members.scss";
import "./assets/_cartpage.scss";
import "./assets/_checkoutForm.scss";
import "./assets/_checkoutPayment.scss";
import "./assets/_CheckoutSuccess.scss";
import { Provider } from "react-redux";
import store from "./redux/store.js";
const router = createHashRouter(routes);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router}>{/* <App /> */}</RouterProvider>
  </Provider>
);
