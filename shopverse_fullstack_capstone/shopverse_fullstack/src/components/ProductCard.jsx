import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-wrap" aria-label={`View ${product.name}`}>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
      </Link>
      <div className="product-info">
        <div className="product-meta"><span>{product.category}</span><span className="rating"><Star size={13} fill="currentColor"/>{product.rating}</span></div>
        <Link to={`/product/${product.id}`} className="product-name">{product.name}</Link>
        <div className="product-bottom">
          <div><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</div>
          <button className="quick-add" onClick={() => addItem(product)} aria-label={`Add ${product.name} to bag`}><ShoppingBag size={17}/></button>
        </div>
      </div>
    </article>
  );
}
