const API_BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}/api${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Unable to complete request.");
  return data;
}

export const getProducts = (params = {}) => {
  const query = new URLSearchParams(params);
  return request(`/products?${query.toString()}`);
};
export const getProduct = (id) => request(`/products/${id}`);
export const getCategories = () => request("/categories");
export const submitCheckout = (payload) => request("/checkout", {
  method: "POST",
  body: JSON.stringify(payload)
});
