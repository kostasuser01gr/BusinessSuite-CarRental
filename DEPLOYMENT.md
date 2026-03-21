# Deployment Guide

This project is architected for a split deployment:
- **Frontend:** React (Vite) deployed to **Vercel**.
- **Backend:** Node.js (Express) deployed to **Railway**.

---

## 🏗️ Local Development

1.  **Environment Setup:**
    ```bash
    cp .env.example .env
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Start Services:**
    ```bash
    npm run dev
    ```
    - Frontend: `http://localhost:3100`
    - Backend: `http://localhost:5000`

---

## 🎨 Frontend Deployment (Vercel)

1.  **Connect Repository:** Point Vercel to this repo.
2.  **Root Directory:** `client` (or keep root and use `npm run build:client` if Vercel allows, but typically `client` is the subdirectory).
    *Note: If deploying from the root, set the build command to `npm run build:client` and output directory to `dist/client`.*
3.  **Environment Variables:**
    - `VITE_API_URL`: Your backend URL (e.g., `https://adaptive-backend.up.railway.app`).
4.  **Build Command:** `npm run build:client`
5.  **Output Directory:** `dist/client`

---

## ⚙️ Backend Deployment (Railway)

1.  **Connect Repository:** Point Railway to this repo.
2.  **Environment Variables:**
    - `NODE_ENV`: `production`
    - `SESSION_SECRET`: A random 32+ character string.
    - `VITE_CLIENT_URL`: Your frontend URL (e.g., `https://adaptive-ai.vercel.app`).
    - `PORT`: `5000` (Railway often provides this automatically).
3.  **Build Command:** `npm run build:server`
4.  **Start Command:** `npm start` (Runs `node dist/server/index.js`).

---

## 🚑 Health & Readiness

The backend provides a health check endpoint at `/health`.
Ensure your deployment platform uses this to verify the service is up.

---

## ⚠️ Known Risks & Notes

- **CORS:** Ensure `VITE_CLIENT_URL` matches exactly (including protocol) the frontend URL, or login sessions will fail due to cookie restrictions.
- **Cookies:** Production uses `secure: true` and `sameSite: 'none'`. This requires HTTPS on both ends.
- **In-Memory Store:** The current baseline uses an in-memory user store. Restarts on Railway **will wipe all users**. A database migration (PostgreSQL) is the next architectural step.
