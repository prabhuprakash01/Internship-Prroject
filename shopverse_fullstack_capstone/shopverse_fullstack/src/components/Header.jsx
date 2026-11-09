import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const { count } = useCart();
  return (
    <>
      <div className="announcement">A little something for your everyday&nbsp; <span>✦</span> &nbsp;Free delivery over ₹2,999</div>
      <header className="site-header">
        <div className="header-inner container">
          <Link className="brand" to="/" aria-label="ShopVerse home"><span className="brand-mark"><Sparkles size={18}/></span>shopverse<span className="brand-dot">.</span></Link>
          <nav className="main-nav" aria-label="Main navigation">
            <NavLink to="/" end>Discover</NavLink>
            <a href="/#catalog">Shop all</a>
            <a href="/#story">Our story</a>
          </nav>
          <Link className="cart-link" to="/cart" aria-label={`Shopping bag, ${count} items`}>
            <ShoppingBag size={19}/><span>Bag</span><b>{count}</b>
          </Link>
        </div>
      </header>
    </>
  );
}
