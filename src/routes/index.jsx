import Layout from "../Layout";
import Home from "../views/Home";
import ProductList from "../views/ProductList";
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
      //   {
      //     path: "products/:id",
      //     element: <Products />,
      //   },
    ],
  },
];

export default routes;
