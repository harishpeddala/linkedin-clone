# LinkedIn Clone — Backend

RESTful API for the LinkedIn Clone application, built with **Node.js**, **Express**, and **MongoDB (Mongoose)**. It handles authentication (email/password + Google OAuth), posts, comments, notifications, real-time messaging (Socket.IO), and the professional network (friends/connections).

---

## Tech Stack

| Concern | Library |
|---|---|
| Runtime | Node.js |
| Web framework | Express 5 |
| Database | MongoDB + Mongoose |
| Authentication | JSON Web Tokens (`jsonwebtoken`), httpOnly cookies |
| Password hashing | `bcryptjs` |
| Google Sign-In | `google-auth-library` |
| Real-time chat | `socket.io` |
| Config | `dotenv` |
| Cookies / CORS | `cookie-parser`, `cors` |

---

## Prerequisites

These **must** be installed and available before running the backend:

- **Node.js** v18 or higher — [download](https://nodejs.org/)
- **npm** (bundled with Node.js)
- **MongoDB** running locally on `mongodb://localhost:27017` — [Community Server](https://www.mongodb.com/try/download/community) or a MongoDB Atlas connection string
- A **Google Cloud OAuth 2.0 Client ID** (required for Google login) — [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

---

## Mandatory Environment Variables

The server will not work correctly without these. Create a file named **`config.env`** in the `linkedin-backend/` folder:

```env
PORT=3000
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
JWT_PRIVATE_KEY=your-strong-secret-key
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | Optional (defaults to `3000`) | Port the API listens on |
| `GOOGLE_CLIENT_ID` | **Mandatory** for Google login | OAuth client ID used to verify Google ID tokens |
| `JWT_PRIVATE_KEY` | **Mandatory** | Secret used to sign authentication JWTs |

> **Security:** `config.env` is git-ignored and must never be committed. Use a strong, unique `JWT_PRIVATE_KEY` in production.

---

## Installation & Setup

```bash
# 1. Move into the backend folder
cd linkedin-clone/linkedin-backend

# 2. Install dependencies
npm install

# 3. Create config.env (see "Mandatory Environment Variables" above)

# 4. Make sure MongoDB is running locally

# 5. Start the development server (nodemon auto-restarts on changes)
npm start
```

Once running you should see:

```
MongoDB connected successfully
Click to follow: http://localhost:3000
```

---

## API Overview

Base URL: `http://localhost:3000`

Authenticated routes require the httpOnly `token` cookie, which is set automatically on successful login/register.

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register with email, password, name |
| POST | `/login` | No | Log in with email/password |
| POST | `/google` | No | Log in / register via Google ID token |
| GET | `/self` | Yes | Get the current logged-in user |
| GET | `/user/:id` | No | Get a user profile by ID |
| PUT | `/update` | Yes | Update the current user's profile |
| GET | `/findUser?query=` | Yes | Search users by name/email |
| POST | `/sendFriendRequest` | Yes | Send a connection request |
| POST | `/acceptFriendRequest` | Yes | Accept a connection request |
| GET | `/getFriendsList` | Yes | List accepted connections |
| GET | `/getPendingFriendsList` | Yes | List pending requests |
| DELETE | `/removeFriend/:friendId` | Yes | Remove a connection |
| POST | `/logout` | Yes | Clear the auth cookie |

### Posts — `/api/post`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes | Create a post |
| POST | `/likeDislike` | Yes | Toggle like on a post |
| GET | `/getAllPosts` | No | Get all posts (feed) |
| GET | `/getPostById/:id` | Yes | Get a single post |
| GET | `/getTop5Posts/:id` | Yes | Get a user's 5 most recent posts |
| GET | `/getUserPosts/:id` | Yes | Get all posts by a user |

### Comments — `/api/comment`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes | Add a comment to a post |
| GET | `/:postId` | Yes | Get comments for a post |

### Notifications — `/api/notification`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | Get all notifications |
| PUT | `/markAsRead` | Yes | Mark notification(s) as read |
| GET | `/activeNotifications` | Yes | Get unread notifications |

### Conversations — `/api/conversation`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/addConversation` | Yes | Start / fetch a conversation |
| GET | `/getConversations` | Yes | List the user's conversations |

### Messages — `/api/message`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes | Send a message |
| GET | `/:conversationId` | Yes | Get messages in a conversation |

> A ready-to-import **Postman collection** covering all of the above lives at [`postman/LinkedIn-Clone.postman_collection.json`](../../postman/LinkedIn-Clone.postman_collection.json). Run a **Login** request first so the auth cookie is stored, then call the protected endpoints.

---

## Real-Time Messaging (Socket.IO)

The server exposes a Socket.IO endpoint (same origin, port `3000`) with these events:

- `joinConversation` — client joins a conversation room by `conversationId`
- `sendMessage` — broadcasts a message to everyone in the room
- `receiveMessage` — emitted to clients in the room when a new message arrives

CORS for sockets is restricted to the frontend origin `http://localhost:5173`.

---

## Project Structure

```
linkedin-backend/
├── authentication/     # JWT auth middleware
├── controller/         # Route handlers (business logic)
├── models/             # Mongoose schemas
├── routes/             # Express route definitions
├── Images/             # Static/sample assets
├── connection.js       # MongoDB connection
├── index.js            # App entry point + Socket.IO
├── config.env          # Environment variables (git-ignored)
└── package.json
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Run the server with nodemon (auto-reload) |
