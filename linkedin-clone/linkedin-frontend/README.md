# LinkedIn Clone — Frontend

A responsive LinkedIn-style single-page application built with **React 19**, **Vite**, and **Tailwind CSS**. It features a feed, profiles, a professional network (connections), real-time messaging, notifications, and Google authentication.

---

## Tech Stack

| Concern | Library |
|---|---|
| Framework | React 19 |
| Build tool | Vite |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| HTTP client | Axios |
| UI icons/components | Material UI (`@mui/material`, `@mui/icons-material`) |
| Google Sign-In | `@react-oauth/google` |
| Real-time chat | `socket.io-client` |
| Notifications/toasts | `react-toastify` |

---

## Prerequisites

These **must** be installed before running the frontend:

- **Node.js** v18 or higher — [download](https://nodejs.org/)
- **npm** (bundled with Node.js)
- The **backend API** running at `http://localhost:3000` (see [`linkedin-backend/README.md`](../linkedin-backend/README.md))
- A **Google OAuth 2.0 Client ID** (required for Google login), matching the one configured in the backend

---

## Mandatory Configuration

The app talks to the backend at `http://localhost:3000` and expects the backend to be running.

- **Google login** requires a valid Google OAuth Client ID wired into the app (via `@react-oauth/google`). It must match the `GOOGLE_CLIENT_ID` used by the backend.
- The Vite dev server runs on **`http://localhost:5173`**, which the backend already whitelists for CORS. If you change this port, update the backend CORS origin accordingly.

---

## Installation & Setup

```bash
# 1. Move into the frontend folder
cd linkedin-clone/linkedin-frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**.

> Make sure the backend is running first, otherwise API calls (login, feed, etc.) will fail.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Build the production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## Project Structure

```
linkedin-frontend/
├── public/             # Static assets served as-is
├── src/
│   ├── components/     # Reusable UI components & modals
│   ├── pages/          # Route-level pages (Feeds, Profile, Messages, ...)
│   ├── assets/         # Images and icons
│   ├── App.jsx         # App routes
│   └── main.jsx        # Entry point (BrowserRouter)
├── socket.js           # Socket.IO client setup
├── vite.config.js      # Vite + Tailwind config
└── package.json
```

---

## Notes

- **CORS:** the frontend requests resources from the backend; the backend must whitelist the frontend origin (`http://localhost:5173`), which it already does by default.
- **Real-time messaging:** powered by `socket.io-client`, connecting to the backend's Socket.IO server on port `3000`.
- **Auto-formatting:** in VS Code use `Shift + Alt + F` to format files.
