# VaultPay — Enterprise Core Banking Application

VaultPay is a modern, enterprise-grade Core Banking platform built with a React 19 frontend and a Node.js/Express backend. It features strict double-entry accounting, UPI payment integration, AI-powered financial analytics, gamified rewards, and emergency recovery functionalities.

The application features a highly polished "Dark Aurora" premium theme with True Black OLED backgrounds, metallic gradients, and fluid micro-animations.

---

## 🌟 Key Features

### 1. **Premium "Dark Aurora" UI**
- True Black background with neon emerald, purple, and gold metallic accents.
- Responsive design with glassmorphism panels, interactive glow effects, and staggered animations.
- Interactive Dashboard with real-time balance tracking, AI-generated insights, and a gamified "Vault Rewards" widget showing user tier progression.

### 2. **Double-Entry Ledger Engine**
- A robust backend using **Prisma + SQLite** (easily swappable to PostgreSQL).
- Strict atomic transactions ensure balances never desync. Every financial movement records a corresponding debit and credit in the `postings` and `journal_entries` tables.

### 3. **UPI & Payment Mocking**
- Handles Indian UPI integrations including Intent deep links (`upi://pay`), dynamic QR Code generation with countdowns, and VPA collect requests.
- Custom **PSP Simulator** on the backend that mocks unpredictable payment delays (3s–8s) and sends cryptographically secure HMAC-SHA256 webhooks to finalize transactions asynchronously.

### 4. **AI Analytics & PFM**
- Dedicated Analytics page built with **Recharts** providing a visual breakdown of spending across categories.
- Vault AI widget identifies spending trends and generates smart suggestions (e.g., subscription tracking or high dining spend alerts).

### 5. **Virtual Cards & Controls**
- Generates simulated virtual debit cards using the Luhn algorithm.
- 3D interactive flipping card UI.
- Users can adjust daily limits, freeze/unfreeze cards, and toggle contactless/online transaction permissions.

### 6. **Emergency Cross-Device Recovery**
- Users can set up a unique `alias_url` and a secondary PIN for emergency situations.
- If a user loses their phone, they can log into the emergency portal and securely retrieve funds to a secondary emergency wallet.

---

## 🏗️ Technology Stack

**Frontend:**
- **Framework:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS v4 (with custom `@theme` utilities and keyframes)
- **Icons:** `lucide-react`
- **Charts:** `recharts`
- **Data Fetching:** `@tanstack/react-query`
- **Routing:** `react-router-dom`

**Backend:**
- **Server:** Node.js + Express.js
- **Database ORM:** Prisma (SQLite for local dev)
- **Validation:** Zod
- **Auth:** JWT (JSON Web Tokens)
- **Security:** Helmet, CORS, Rate Limiting (via `express-rate-limit`)

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have Node.js (v20 or v22) installed.

### 1. Setup the Backend
Open a terminal and navigate to the backend directory:
```bash
cd backend

# Install backend dependencies
npm install

# Push the Prisma schema to create the SQLite dev.db
npx prisma db push

# Generate the Prisma Client
npx prisma generate

# Seed the database with demo users, accounts, and transactions
npx tsx prisma/seed.ts

# Start the Express server (Runs on port 5000)
npm run dev
```

### 2. Setup the Frontend
Open a new terminal and navigate to the project root:
```bash
# Install frontend dependencies
npm install

# Start the Vite development server (Runs on port 3000)
npm run dev
```

### 3. Login
Once both servers are running, open **http://localhost:3000** in your browser. 
You can log in using the seeded demo credentials:

- **Email:** `rahul@vaultpay.in`
- **Password:** `demo1234`

*(Alternatively, use `priya@vaultpay.in` or `admin@vaultpay.in` with the same password).*

---

## 📂 Project Structure

```text
VaultPay/
├── package.json             # Frontend dependencies
├── vite.config.ts           # Vite + Tailwind v4 config (Proxies /api to backend)
├── src/                     # React Frontend
│   ├── index.css            # Dark Aurora design system & animations
│   ├── main.tsx             # React entry & QueryClient setup
│   ├── App.tsx              # Router & Protected routes
│   ├── components/          # Reusable UI (Cards, Modals, Forms, Sidebar)
│   ├── pages/               # 7 App Pages (Dashboard, Analytics, etc.)
│   ├── hooks/               # Custom hooks for auth & fetching
│   └── services/            # API client (with mock data fallback)
└── backend/                 # Express Backend
    ├── package.json         # Backend dependencies
    ├── prisma/              # Database schema (schema.prisma) & seed script
    └── src/                 
        ├── index.ts         # Express server setup & webhook mounts
        ├── controllers/     # Route handlers
        ├── services/        # Core business logic (Ledger, UPI, Cards, PSP Simulator)
        └── routes/          # API route definitions
```

---

## 💡 Notes
- The frontend `api.ts` service is currently equipped with mock data delays. If the backend is running, you can connect the React app to the Express API by adjusting the endpoints in `src/services/api.ts` to use actual fetch calls against `/api/v1/...` instead of returning mock data.
- The `node_modules` folders have been excluded from this package. Be sure to run `npm install` in both the root directory and the `/backend` directory before starting.
