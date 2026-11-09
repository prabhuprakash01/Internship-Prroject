import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, ShoppingBag, Star } from "lucide-react";
import { getProduct } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const { addItem } = useCart();
  useEffect(() => { getProduct(id).then(setProduct).catch((err) => setError(err.message)); }, [id]);

  if (error) return <main className="page-wrap"><div className="status-box error">{error}</div><Link className="text-link" to="/">Back to shop</Link></main>;
  if (!product) return <main className="page-wrap"><div className="status-box">Loading product…</div></main>;

  return <main className="page-wrap product-detail container">
    <Link className="back-link" to="/"><ArrowLeft size={16}/> Back to collection</Link>
    <div className="detail-layout">
      <div className="detail-image"><img src={product.image} alt={product.name}/></div>
      <div className="detail-copy">
        <p className="eyebrow">{product.category} / SHOPVERSE EDIT</p>
        <h1>{product.name}</h1>
        <div className="detail-rating"><Star size={15} fill="currentColor"/>{product.rating} <span>({product.reviews} reviews)</span></div>
        <div className="detail-price"><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</div>
        <p className="detail-description">{product.description}</p>
        <div className="detail-spec"><span>Colour</span><b>{product.color}</b></div>
        <div className="availability"><Check size={16}/> In stock · Ready to ship</div>
        <button className="button button-dark add-large" onClick={() => addItem(product)}><ShoppingBag size={17}/> Add to bag</button>
        <p className="fine-print">Demo storefront · No payment is collected.</p>
      </div>
    </div>
  </main>;
}
