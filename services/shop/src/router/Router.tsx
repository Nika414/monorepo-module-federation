import App from "@/components/App";
import { LazyShop } from "@/components/Shop/Shop.lazy";
import { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";


const routes = [
    {
      path: '/shop',
      element: <App />,
      children: [
        
        { path: 'main', element: <Suspense><LazyShop /></Suspense> },
        { path: 'second', element: <div>test second</div> },
      ],
    },
  ]


export const router = createBrowserRouter(routes);

export default routes;