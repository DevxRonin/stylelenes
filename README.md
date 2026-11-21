# StyleLens – Haute Lunetterie & Premium Eyewear Platform

**StyleLens** is a full-stack, production-ready luxury e-commerce platform dedicated to designer sunglasses, optical frames, and haute eyewear. Designed with an editorial aesthetic inspired by Milanese and Parisian ateliers, it features deep piano black tones, 24K luxury gold accents, glassmorphism cards, and an integrated AI Eyewear Styling Concierge.

---

## 1. Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React icons, Canvas-Confetti
- **Backend**: Node.js, Express.js, MongoDB Atlas with Mongoose ORM, CORS, Dotenv
- **AI Stylist Concierge**: Dual-mode engine (LLM API support with Google Gemini / OpenAI + smart rule-based fallback analyzing budget, face shapes, occasions, and real catalog inventory)
- **Deployment**:
  - Frontend: [Vercel](https://vercel.com)
  - Backend: [Render](https://render.com)
  - Database: [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 2. Design System & Luxury Aesthetics

- **Color Palette**:
  - Primary Obsidian Black: `#0A0A0A`
  - Luxury Gold Accent: `#C9A227` (with light gold `#DFB83E` and dark gold `#9F7C14`)
  - Crisp White: `#FFFFFF`
  - Subtle Frosted Grey: `#F5F5F5`
  - Glass Card Background: `rgba(22, 22, 22, 0.75)` with `backdrop-filter: blur(16px)`
- **Typography**:
  - Headings & Editorial Titles: **Playfair Display**
  - Body Text & Metrics: **Inter**
- **Design Signature**:
  - 22px rounded cards (`rounded-[22px]`)
  - 3D luxury shadows (`box-shadow: 0 20px 40px rgba(0,0,0,0.12)`)
  - Smooth hover lift (`transform: translateY(-6px)`)
  - High-resolution product image zoom on hover
  - Gold pill gradient CTA buttons with glow effects
  - 100% mobile-first, responsive architecture

---

## 3. Pages & Features

1. **Homepage (`/`)**:
   - Sticky glassmorphic navigation bar with live shopping bag counter
   - Promotional marquee announcement ticker
   - Grand luxury hero section with CTA buttons ("Shop Now", "Explore Collection", "Ask AI Stylist")
   - Curated Categories grid: Sunglasses, Men's Frames, Women's Eyewear, Unisex, Premium 18K Gold
   - Dynamic tabbed product collection (Featured, Best Sellers, New Arrivals)
   - Brand Craftsmanship section detailing Italian Mazzucchelli bio-acetate
   - Verified customer review testimonials with 5-star ratings
   - VIP Connoisseur Club newsletter subscription with instant promo code
   - Comprehensive luxury footer with flagship showroom locations
2. **Catalog / Shop Page (`/shop`)**:
   - Live real-time search across frame names, descriptions, shapes, and materials
   - Category filtering (Sunglasses, Men, Women, Unisex, Premium Collection, All)
   - Price range filtering (Under ₹999, ₹1,000 – ₹2,500, ₹2,500 – ₹5,000, Above ₹5,000)
   - Minimum rating filtering (4.8★+, 4.5★+, 4.0★+)
   - Sorting options (Popularity, Price: Low to High, Price: High to Low, Featured)
   - Instant filter reset chips and active count indicator
3. **Product Details Page (`/product/[id]`)**:
   - Multi-image gallery with interactive thumbnail switcher and zoom
   - Frame name, luxury badge, rating, verified reviews count
   - Pricing in INR with original price strikethrough and discount savings badge
   - Stock availability indicator ("In Stock (X units available)")
   - Comprehensive optical specifications table (Frame Shape, Material, Lens Tech, Lens Tint)
   - Quantity selector with stock upper limit protection
   - "Add to Bag" button with animated feedback + "Buy Now with Express" direct checkout flow
   - Related products recommendation slider
4. **Shopping Cart (`/cart` & Slide-Over Drawer)**:
   - Slide-over bag accessible from any page via navigation bar
   - Dedicated cart view at `/cart`
   - Real-time quantity adjustment, item removal, and subtotal calculation
   - Free Express Delivery progress bar (unlocks at ₹999)
   - Coupon voucher engine (e.g. `STYLELENS` or `LUXURY10` for 10% instant discount)
   - Persistent bag storage via `localStorage`
5. **Checkout Page (`/checkout`)**:
   - Comprehensive customer and delivery form: Full Name, 10-Digit Mobile, Email, Street Address, City, State, 6-Digit PIN Code
   - Real-time input validation with inline error alerts
   - Payment options:
     - **Cash on Delivery (COD)**: Verified upon delivery with agent OTP
     - **Instant UPI**: PhonePe / Google Pay / Paytm with VPA validation
     - **Credit/Debit Card (Demo Mode)**: Explicitly indicated demo card simulator
   - Live order calculation (Subtotal, Courier, Discount, Total)
   - Decrements stock in database and saves order in MongoDB with unique identifier `SL-XXXXXX-XXXX`
   - Post-order celebratory confetti animation and detailed order confirmation receipt
6. **Orders Portal (`/orders`)**:
   - Order history retrieved from backend API (`GET /api/orders`)
   - Search by Order ID, Customer Name, or Phone
   - Shows Order ID, Customer name, Items list with image and quantity, Total price, Payment method, and Order timestamp
   - Status indicators (Placed, Processing, Shipped, Delivered)
   - Interactive modal: "Track Dispatch" showcasing the 4-stage blue-dart timeline
7. **AI Shopping Assistant Concierge (`/ai-assistant` & Floating Widget)**:
   - Floating gold widget accessible on every screen
   - Dedicated full-page styling consultation suite at `/ai-assistant`
   - Handles queries such as:
     - *"Suggest the best sunglasses under ₹999."*
     - *"Which eyewear is best for daily use?"*
     - *"Show premium black sunglasses."*
     - *"Recommend eyewear for formal occasions."*
   - Returns personalized recommendations with live database product cards, prices, and 1-click "Add to Bag" buttons directly inside the chat stream.

---

## 4. Project Structure

```
StyleLens/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & status monitor
│   ├── controllers/
│   │   ├── productController.js  # Product queries, search, filter & sorting
│   │   ├── orderController.js    # Order creation, validation & stock decrement
│   │   └── aiController.js       # AI shopping concierge & rule-based engine
│   ├── data/
│   │   └── seedProducts.js       # 12+ luxury eyewear demo products
│   ├── middleware/
│   │   └── errorHandler.js       # Global JSON error & 404 handler
│   ├── models/
│   │   ├── Product.js            # Mongoose Product Schema
│   │   └── Order.js              # Mongoose Order Schema
│   ├── routes/
│   │   ├── productRoutes.js      # /api/products endpoints
│   │   ├── orderRoutes.js        # /api/orders endpoints
│   │   └── aiRoutes.js           # /api/ai/chat endpoint
│   ├── .env                      # Local environment configuration
│   ├── .env.example              # Template for environment variables
│   ├── package.json              # Backend dependencies & scripts
│   ├── seed.js                   # Database seeder script
│   └── server.js                 # Express application server
│
├── frontend/
│   ├── app/
│   │   ├── ai-assistant/page.js  # Dedicated AI Stylist Concierge
│   │   ├── cart/page.js          # Dedicated Shopping Cart Page
│   │   ├── checkout/page.js      # Luxury Multi-Step Checkout
│   │   ├── orders/page.js        # Orders Ledger & Tracking
│   │   ├── product/[id]/page.js  # Product Detail & Gallery
│   │   ├── shop/page.js          # Eyewear Catalog & Filters
│   │   ├── globals.css           # Tailwind + Custom Luxury CSS
│   │   ├── layout.js             # Root Layout with Nav, Bag & Footer
│   │   └── page.js               # Homepage
│   ├── components/
│   │   ├── AIAssistantModal.jsx  # Floating AI Stylist Concierge
│   │   ├── CartDrawer.jsx        # Slide-over Bag Drawer
│   │   ├── Footer.jsx            # Luxury Brand Footer
│   │   ├── Hero.jsx              # Grand Editorial Hero Banner
│   │   ├── Marquee.jsx           # Gold Announcement Ticker
│   │   ├── Navbar.jsx            # Sticky Glass Navigation
│   │   ├── ProductCard.jsx       # 22px Rounded Luxury Card
│   │   ├── ReviewCard.jsx        # Customer Testimonial Card
│   │   └── TrustBadges.jsx       # Optical Quality Guarantees
│   ├── lib/
│   │   ├── api.js                # API Client with Resilient Fallback
│   │   ├── cartContext.js        # Global Cart State & LocalStorage
│   │   └── productsData.js       # Standalone Client Fallback Catalog
│   ├── .env.local                # Local Frontend API URL
│   ├── .env.example              # Template for Vercel deployment
│   ├── next.config.js            # Next.js Image Optimization Config
│   ├── package.json              # Frontend dependencies
│   ├── postcss.config.js         # PostCSS configuration
│   └── tailwind.config.js        # StyleLens Tailwind Theme
│
├── .gitignore
└── README.md
```

---

## 5. Local Execution Instructions

### Prerequisites
- Node.js (v18.0.0 or higher recommended, tested on v22)
- npm or pnpm
- MongoDB Atlas account (optional for local demo; fallback mode works automatically)

### Step 1: Backend Setup
```bash
cd backend
npm install
```

Configure `backend/.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGO_URI=mongodb+srv://<USER>:<PASS>@cluster0.mongodb.net/stylelens?retryWrites=true&w=majority

# Optional: Add for LLM API integration
# GEMINI_API_KEY=your_gemini_key_here
# OPENAI_API_KEY=your_openai_key_here
```

To seed the database with 12+ luxury demo products:
```bash
npm run seed
```

Start the backend server:
```bash
npm start
```
The backend will run on `http://localhost:5000`.

### Step 2: Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
```

Configure `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 6. MongoDB Atlas Setup Guide

1. Sign in or create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a new free cluster (Shared M0).
3. Under **Security > Database Access**, create a user with read/write privileges.
4. Under **Security > Network Access**, click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Under **Deployment > Database**, click **Connect > Drivers > Node.js**.
6. Copy the connection string and paste it into `backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/stylelens?retryWrites=true&w=majority
   ```
7. Run the seeder to populate the catalog:
   ```bash
   cd backend
   node seed.js
   ```

---

## 7. Deployment Instructions

### A. Deploy Backend to Render

1. Push this repository to GitHub.
2. Sign in to [Render Dashboard](https://dashboard.render.com).
3. Click **New + > Web Service** and connect your GitHub repository.
4. Set the configuration:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. In **Environment Variables**, add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `FRONTEND_URL`: `https://your-stylelens.vercel.app`
6. Click **Create Web Service**. Copy the assigned URL (e.g., `https://stylelens-api.onrender.com`).

### B. Deploy Frontend to Vercel

1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New... > Project** and import the GitHub repository.
3. In the project configuration:
   - **Root Directory**: Select `frontend`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: `https://stylelens-api.onrender.com` (your Render backend URL)
5. Click **Deploy**. Vercel will create an optimized production build.

---

## 8. Live Deployment Verification Checklist

- [x] Sticky glass navigation bar remains responsive with shopping bag live item counter.
- [x] All 7 required pages render cleanly with zero compile/runtime errors.
- [x] Product images zoom gracefully on hover with 22px rounded cards.
- [x] Category, price range, and rating filters update the catalog instantly.
- [x] Cart persists across page reloads using `localStorage`.
- [x] Free delivery indicator dynamically calculates remaining amount to reach ₹999.
- [x] Checkout validates inputs (10-digit phone, 6-digit PIN, valid email).
- [x] Placing an order validates stock and registers the order with a unique `SL-` Order ID.
- [x] Orders page allows looking up consignments by ID with a 4-step BlueDart tracker.
- [x] AI Shopping Concierge handles budget questions ("under ₹999"), occasions, and face shapes, recommending actual products with 1-click cart addition.
- [x] Production build passes `next build` with 100% static & dynamic page validation.
