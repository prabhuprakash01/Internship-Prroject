# ShopVerse — Full-Stack Web Development Capstone

A responsive e-commerce product discovery demo built with **React, React Router, Node.js and Express**. It includes a REST API, product search/filter/sort, product details, a persistent cart, and a demo checkout flow.

> This is a learning/capstone storefront. It does not process real payments, create a permanent order record, or include customer authentication. Checkout only returns a demo order reference.

## Technology stack

- **Frontend:** React 19, Vite, React Router, Lucide icons, Context API
- **Backend:** Node.js, Express 5, REST endpoints
- **State:** React Context + `localStorage` cart persistence
- **Deployment:** Render Node web service (single service serves both API and built frontend)

## Project structure

```text
shopverse_fullstack/
├── server/
│   ├── data/products.js       # Demo product catalog
│   └── index.js               # Express REST API + production static server
├── src/
│   ├── components/            # Header, product card
│   ├── context/               # Cart state provider
│   ├── pages/                 # Home, product, cart, checkout
│   ├── api.js                 # API client
│   ├── App.jsx                # Client-side routes
│   ├── main.jsx               # React entry
│   └── styles.css             # Responsive design system
├── index.html
├── vite.config.js
├── render.yaml
└── package.json
```

## Run locally in VS Code

1. Install **Node.js 20.19+** and VS Code.
2. Extract the ZIP and open the `shopverse_fullstack` folder in VS Code.
3. Open Terminal → New Terminal.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start frontend and backend together:

   ```bash
   npm run dev
   ```

6. Open the Vite address shown in the terminal (normally `http://localhost:5173`).

The frontend uses the Vite development proxy for `/api` requests. The Express API runs on port `5000`.

### Useful API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health check |
| GET | `/api/categories` | Product categories |
| GET | `/api/products` | Product catalog |
| GET | `/api/products?search=lamp&category=Home` | Search/filter |
| GET | `/api/products?sort=price-low` | Sort products |
| GET | `/api/products/p1` | Single product |
| POST | `/api/checkout` | Demo checkout response |

## Production build

```bash
npm run build
npm start
```

Open `http://localhost:5000`. In production mode, Express serves the optimized `dist` frontend and the API from the same origin.

## Deploy to Render

The included `render.yaml` is a Render Blueprint for a single Node web service.

1. Create a GitHub repository and upload this project folder.
2. Sign in to Render and choose **New → Blueprint**.
3. Connect the repository containing `render.yaml`.
4. Review the service settings and deploy.
5. Render builds with `npm install && npm run build`, starts with `npm start`, and checks `/api/health`.
6. When deployment succeeds, Render displays the public `*.onrender.com` URL.

You can also create a Render **Web Service** manually with:
- Runtime: Node
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variable: `NODE_ENV=production`

The free Render service may sleep after inactivity, so its first request after a quiet period can take longer. See Render's current plan details before relying on it for a presentation.

## Performance and quality features

- Vite production build generates optimized, hashed assets and splits vendor code.
- Images use responsive CDN query parameters, lazy loading below the fold, and async decoding.
- Hero image is prioritized; remote image host is preconnected.
- Express sends long-lived cache headers for built assets and revalidates `index.html`.
- React Router supports product detail, cart and checkout URLs; Express fallback supports direct page refresh.
- Responsive CSS, semantic landmarks, form labels, skip link, visible keyboard focus and reduced-motion support.
- API validates checkout input and returns consistent HTTP error responses.

## Before calling it a real production store

For a real business deployment, add a database (PostgreSQL/MongoDB), authentication and authorization, server-side inventory/price validation, payment provider integration, order persistence, rate limiting, request logging, automated tests, privacy/terms pages, and security review. Never store card details yourself.
