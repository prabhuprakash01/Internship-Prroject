import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  if (!items.length) return <main className="page-wrap container empty-cart"><div className="empty-icon">✳</div><p className="eyebrow">YOUR BAG</p><h1>It's looking a little <em>empty.</em></h1><p className="muted">Your next favorite is waiting to be found.</p><Link className="button button-dark" to="/">Explore the collection</Link></main>;

  return <main className="page-wrap container cart-page">
    <Link className="back-link" to="/"><ArrowLeft size={16}/> Continue shopping</Link>
    <div className="cart-heading"><div><p className="eyebrow">YOUR BAG</p><h1>Good choices.</h1></div><span>{items.length} product{items.length !== 1 ? "s" : ""}</span></div>
    <div className="cart-layout">
      <div className="cart-items">{items.map((item) => <article className="cart-item" key={item.id}>
        <img src={item.image} alt={item.name}/>
        <div className="cart-item-info"><span>{item.category}</span><h3>{item.name}</h3><b>{money(item.price)}</b>
          <div className="quantity-control"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`}><Minus size={14}/></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`}><Plus size={14}/></button></div>
        </div>
        <button className="remove-button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={17}/></button>
      </article>)}</div>
      <aside className="summary-card"><p className="eyebrow">ORDER SUMMARY</p><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Delivery</span><b>{subtotal >= 2999 ? "Free" : "Calculated at checkout"}</b></div><hr/><div className="summary-total"><span>Total</span><strong>{money(subtotal)}</strong></div><Link to="/checkout" className="button button-dark checkout-button">Continue to checkout</Link><small>Secure checkout demo · No payment required</small></aside>
    </div>
  </main>;
}
