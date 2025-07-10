import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import Expenses from "./components/Expenses.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home/>} />
      <Route path="expenses" element={<Expenses />} />
      <Route path="profile" element={<h1>Profile Page</h1>} />
      <Route path="login" element={<Login/>} />
      <Route path="logout" element={<h1>Logout Page</h1>} />
      <Route path="signup" element={<SignUp/>} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

