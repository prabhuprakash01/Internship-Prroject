import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { products } from "./data/products.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, "../dist");

app.use(cors());
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "ShopVerse API", timestamp: new Date().toISOString() });
});

app.get("/api/categories", (_req, res) => {
  res.json([...new Set(products.map((product) => product.category))].sort());
});

app.get("/api/products", (req, res) => {
  const { search = "", category = "All", sort = "featured" } = req.query;
  const term = String(search).trim().toLowerCase();
  let result = products.filter((product) => {
    const matchesSearch = !term || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(term);
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  if (sort === "price-low") result.sort((a, b) => a.price - b.price);
  if (sort === "price-high") result.sort((a, b) => b.price - a.price);
  if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
  if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));

  res.json({ count: result.length, products: result });
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((item) => item.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json(product);
});

app.post("/api/checkout", (req, res) => {
  const { items, customer } = req.body ?? {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Your cart is empty." });
  }
  if (!customer?.name?.trim() || !customer?.email?.trim()) {
    return res.status(400).json({ message: "Name and email are required." });
  }
  const orderId = `SV-${Date.now().toString(36).toUpperCase()}`;
  res.status(201).json({
    message: "Demo order received. No payment was taken.",
    orderId,
    itemCount: items.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0)
  });
});

// In production, Express serves the optimized Vite build and supports React Router refreshes.
if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDist, {
    maxAge: "1y",
    immutable: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith("index.html")) res.setHeader("Cache-Control", "no-cache");
    }
  }));
  app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

app.listen(PORT, () => console.log(`ShopVerse server running on port ${PORT}`));
