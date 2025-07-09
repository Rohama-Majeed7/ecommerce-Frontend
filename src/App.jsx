import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header";
import Login from "./components/Login";
import ForgotPage from "./components/ForgotPage";
import SignUp from "./components/SignUp";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authUser } from "./store/authSlice";
import AdminPage from "./components/AdminPage";
import AllUsers from "./components/AllUsers";
import AllProducts from "./components/AllProducts";
import "./App.css";
import CategoryProducts from "./components/HomeComponents/CategoryProducts";
import SingleProductCard from "./components/SingleProductCard";
import Cart from "./components/Cart";
import SearchPage from "./components/SearchPage";
import Success from "./components/Success";
import Cancel from "./components/Cancel";
import OrderPage from "./components/OrderPage";
import AllOrder from "./components/AllOrders";
import WishList from "./components/WishList";
// import Chatbot from "./components/ChatBot";
// import ChatButton from "./components/ChatButton";
const App = () => {
  const dispatch = useDispatch();
  const value = useSelector((state) => state?.authenticator?.value);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://ecommerce-backend-theta-dun.vercel.app/user/user-details",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        dispatch(authUser(response.data));
      }
    };
    fetchData();
  }, [value]);

  return (
    <BrowserRouter>
      <Header />
      {/* <ChatButton /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-page" element={<ForgotPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route
          path="/get-products/:categoryName"
          element={<CategoryProducts />}
        />
        <Route
          path="/single-product/:productId"
          element={<SingleProductCard />}
        />

        <Route path="/admin" element={<AdminPage />}>
          <Route path="users" element={<AllUsers />} />
          <Route path="products" element={<AllProducts />} />
          <Route path="orders" element={<AllOrder />} />
        </Route>
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/order" element={<OrderPage />} />
        {/* <Route path="/chatbot" element={<Chatbot />} /> */}

      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
