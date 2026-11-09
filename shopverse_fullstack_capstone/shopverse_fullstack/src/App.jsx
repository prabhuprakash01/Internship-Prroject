import { Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";

function NotFound() {
  return <main className="page-wrap container empty-cart"><p className="eyebrow">404 / PAGE NOT FOUND</p><h1>Looks like a wrong turn.</h1><a className="button button-dark" href="/">Back to home</a></main>;
}

export default function App() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header/><div id="main-content"><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/product/:id" element={<Product/>}/>
    <Route path="/cart" element={<Cart/>}/>
    <Route path="/checkout" element={<Checkout/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Routes></div></>;
}
