import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { submitCheckout } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", email: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  if (!items.length && !order) return <main className="page-wrap container empty-cart"><h1>Your bag is empty.</h1><Link to="/" className="button button-dark">Back to shop</Link></main>;

  const handleSubmit = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const result = await submitCheckout({ customer: form, items: items.map(({ id, quantity }) => ({ id, quantity })) });
      setOrder(result); clearCart();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  if (order) return <main className="page-wrap container success-page"><CheckCircle2 size={54}/><p className="eyebrow">ORDER CONFIRMED</p><h1>Thanks, {form.name.split(" ")[0]}.</h1><p>{order.message}</p><div className="order-number">Order reference <b>{order.orderId}</b></div><Link to="/" className="button button-dark">Back to ShopVerse</Link></main>;

  return <main className="page-wrap container checkout-page">
    <button className="back-link back-button" onClick={() => navigate("/cart")}><ArrowLeft size={16}/> Back to bag</button>
    <div className="cart-heading"><div><p className="eyebrow">ALMOST YOURS</p><h1>Checkout.</h1></div></div>
    <div className="cart-layout">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2>Your details</h2><p className="muted">This is a demonstration checkout. Do not enter sensitive information.</p>
        <label>Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name"/></label>
        <label>Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"/></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-dark checkout-button" disabled={busy}>{busy ? "Placing demo order…" : "Place demo order"}</button>
      </form>
      <aside className="summary-card"><p className="eyebrow">YOUR ORDER</p>{items.map((item) => <div className="checkout-line" key={item.id}><span>{item.name} × {item.quantity}</span><b>{money(item.price * item.quantity)}</b></div>)}<hr/><div className="summary-total"><span>Total</span><strong>{money(subtotal)}</strong></div><small>No payment gateway is connected.</small></aside>
    </div>
  </main>;
}
