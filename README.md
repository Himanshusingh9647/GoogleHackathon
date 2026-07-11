# PrepChef.ai 🍳 - Accessible AI Cooking To-Do List & Meal Planner

An interactive, full-stack AI-powered personal meal planning application. PrepChef.ai takes daily schedule constraints (e.g., activity levels, physical workloads) and targets (diet type, exclusions, daily budget limit) to generate schedule-aligned breakfast, lunch, and dinner menus, aggregated shopping lists, and smart substitution lists.

## 🚀 Key Features

1. **Schedule-Aligned Menus**: Creates timed daily menus (Breakfast, Lunch, Dinner) explaining *why* each meal fits your schedule (e.g., quick breakfast, post-workout recovery).
2. **Budget Feasibility Logic**: Displays estimated costs per ingredient and flags whether the plan meets your target daily budget, providing AI cost and savings analysis.
3. **Aggregated Grocery Checklist**: Compiles ingredients across all planned meals and groups them by category (Protein, Produce, Dairy, Pantry) with checkoff progress indicators.
4. **Smart Substitutions**: Compares and displays allergen/exclusion substitutions for sensitive ingredients.
5. **Fully Accessible (WCAG 2.1 AA Compliant)**: Built with native focus rings, high-contrast states, keyboard-navigable skip link, and `aria-live` state announcements for dynamic content.

---

## 🛠️ Tech Stack

- **Frontend**: React (Hooks, Functional Components) + Tailwind CSS v4.0.0 + Lucide Icons + Canvas Confetti.
- **Backend**: Node.js + Express.js + Rate Limiting (`express-rate-limit`) + Input Sanitation (`express-validator`).
- **Database & ORM**: SQLite (serverless local database file) + Prisma.

---

## 💻 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v20+ recommended).

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file inside the `backend` folder:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: If `GEMINI_API_KEY` is not provided, the server automatically defaults to an interactive mock generator.*
4. Initialize the Prisma database (SQLite) and run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start the backend:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173/`.

---

## ♿ Accessibility Compliance Details (WCAG 2.1 AA)

- **Semantic Layouts**: Implements `<header>`, `<main>`, `<nav>`, `<aside>`, and `<footer>` tags.
- **Skip Navigation**: Keyboard skip link targets `#main-content` directly.
- **Form Semantics**: Standard labels matching inputs, with `aria-describedby` helper IDs.
- **Live Status Regions**: Implements `aria-live="polite"` to announce loading states, successful generation, and history loads.
- **Color Contrast**: Complies with a minimum 4.5:1 text-to-background contrast ratio (utilizing emerald/amber accents on a deep slate workspace).
