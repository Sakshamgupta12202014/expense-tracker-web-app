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
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Expenses from "./pages/Expenses.jsx";
import Profile from "./pages/Profile.jsx";
import Dashboard from "./pages/Dashboard.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home/>} />
      <Route path="expenses" element={<Expenses />} />
      <Route path="profile" element={<Profile/>} />
      <Route path="login" element={<Login/>} />
      <Route path="logout" element={<h1>Logout Page</h1>} />
      <Route path="signup" element={<SignUp/>} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

