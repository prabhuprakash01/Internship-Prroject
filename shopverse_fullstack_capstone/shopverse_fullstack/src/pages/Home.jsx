import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Search, SlidersHorizontal, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { getCategories, getProducts } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { getCategories().then((data) => setCategories(["All", ...data])).catch(() => {}); }, []);
  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    const timer = setTimeout(() => {
      getProducts({ search, category, sort })
        .then((data) => { if (active) setProducts(data.products); })
        .catch((err) => { if (active) setError(err.message); })
        .finally(() => { if (active) setLoading(false); });
    }, 180);
    return () => { active = false; clearTimeout(timer); };
  }, [search, category, sort]);

  const featured = useMemo(() => products.slice(0, 4), [products]);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line"/> THE EVERYDAY EDIT</p>
          <h1>Good things.<br/><em>Great finds.</em></h1>
          <p className="hero-description">Thoughtful picks for the way you live, work and unwind. Discover pieces you'll reach for every day.</p>
          <a className="button button-dark" href="#catalog">Explore the collection <ArrowRight size={17}/></a>
          <div className="hero-footnote"><span>01 / 03</span><span>Curated for your everyday</span><ArrowDown size={15}/></div>
        </div>
        <div className="hero-visual">
          <img src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1500&q=82" alt="Curated lifestyle collection arranged on a warm neutral background" fetchPriority="high"/>
          <div className="hero-sticker"><span>THE</span><strong>good<br/>stuff</strong><span>IS HERE ✳</span></div>
          <div className="hero-caption">Objects with purpose, picked with care.</div>
        </div>
      </section>

      <section className="benefit-strip container" aria-label="Shopping benefits">
        <div><Truck/><span><b>Easy delivery</b><small>On orders over ₹2999</small></span></div>
        <div><ShieldCheck/><span><b>Quality first</b><small>Thoughtfully selected</small></span></div>
        <div><RefreshCw/><span><b>Easy returns</b><small>7-day return window</small></span></div>
      </section>

      <section className="catalog-section container" id="catalog">
        <div className="section-heading">
          <div><p className="eyebrow">THE SHOP</p><h2>Find your <em>favorite.</em></h2><p className="muted">A considered collection of useful, beautiful things.</p></div>
          <a className="text-link" href="#story">Why ShopVerse? <ArrowUpRight size={16}/></a>
        </div>
        <div className="catalog-toolbar">
          <div className="category-tabs" aria-label="Filter by category">
            {categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <div className="catalog-controls">
            <label className="search-box"><Search size={16}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." aria-label="Search products"/></label>
            <label className="sort-select"><SlidersHorizontal size={15}/><select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option><option value="name">Name A–Z</option></select></label>
          </div>
        </div>
        {loading ? <div className="status-box">Finding the good stuff…</div> : error ? <div className="status-box error">{error} — make sure the API server is running.</div> :
          products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product}/>)}</div> :
          <div className="status-box">No products found. Try another search or category.</div>}
      </section>

      <section className="story-section" id="story">
        <div className="story-image"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80" alt="Warm, thoughtfully designed retail space" loading="lazy"/></div>
        <div className="story-copy"><p className="eyebrow">A SMALLER, BETTER EDIT</p><h2>Less scrolling.<br/><em>More finding.</em></h2><p>We believe the best collections aren't the biggest ones. ShopVerse brings together useful everyday pieces, with clear details and a simple way to find what fits your life.</p><a className="text-link" href="#catalog">Browse the collection <ArrowRight size={16}/></a></div>
      </section>
      <footer className="site-footer"><div className="container footer-inner"><Link className="brand" to="/"><span className="brand-mark">✳</span>shopverse<span className="brand-dot">.</span></Link><span>Made for everyday discovery.</span><span>© {new Date().getFullYear()} ShopVerse · Student capstone demo</span></div></footer>
    </>
  );
}
