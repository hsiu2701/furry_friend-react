import Layout from "../Layout";
import Home from "../views/Home";
import ProductList from "../views/ProductList";
import CheckoutFormPage from "../pages/CheckoutFormPage";
import CheckoutPaymentPage from "../pages/CheckoutPaymentPage";
import CheckoutSuccessPage from "../pages/CheckoutSuccessPage";
import Members from "../pages/MembersPage";
import ProductDetailPage from "../views/ProductDetailPage";
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "productlist",
        element: <ProductList />,
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "checkout",
        element: <CheckoutFormPage />,
      },
      {
        path: "checkout-payment",
        element: <CheckoutPaymentPage />,
      },
      {
        path: "checkout-success",
        element: <CheckoutSuccessPage />,
      },
      {
        path: "members",
        element: <Members />,
      },
    ],
  },
];

export default routes;
