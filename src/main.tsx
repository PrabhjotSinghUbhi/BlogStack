import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./Pages/Home/Home.tsx";
import Protected from "./components/Auth/Layout/Layout.tsx";
import { Login, SignUp } from "./components/index.ts";
import EditPost from "./Pages/EditPost/EditPost.tsx";
import Post from "./Pages/Post/Post.tsx";
import AddPost from "./Pages/AddPost/AddPost.tsx";
import AllPost from "./Pages/AllPost/AllPost.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <Protected authentication={false}>
            <Login />
          </Protected>
        ),
      },
      {
        path: "/signup",
        element: (
          <Protected authentication={false}>
            <SignUp />
          </Protected>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <Protected authentication>
            {" "}
            <AllPost />
          </Protected>
        ),
      },
      {
        path: "/add-post",
        element: (
          <Protected authentication>
            {" "}
            <AddPost />
          </Protected>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <Protected authentication>
            {" "}
            <EditPost />
          </Protected>
        ),
      },
      {
        path: "/post/:slug",
        element: <Post />,
      },
    ],
  },
])

createRoot(document.getElementById("root")!).render(

  <Provider store={store}>
    <RouterProvider router={router}>
    </RouterProvider>
  </Provider>

);
