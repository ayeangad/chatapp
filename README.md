# Real-Time Chat Application

A lightweight, real-time multi-room chat application built using a TypeScript ecosystem. The app features secure JWT-based user authentication, instant messaging via native WebSockets, and database persistence powered by Prisma ORM.

## Features

- **Real-Time Messaging:** Instant message delivery across chat rooms using WebSockets (`ws`).
- **Authentication:** Secure user sign-up and sign-in functionality using JWT tokens.
- **Room-Based Chatting:** Users can connect and chat with multiple participants in isolated rooms.
- **Database Persistence:** Robust data handling and user validation using Prisma.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite, React, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Real-Time | WebSockets (`ws` library) |
| Database & ORM | Prisma ORM (with PostgreSQL/MySQL/SQLite) |
| Authentication | JSON Web Tokens (JWT) |

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- An active database instance compatible with Prisma

### Installation & Setup

**1. Clone the repository:**

```bash
git clone https://github.com/your-username/chatapp.git
cd chatapp
```

**2. Backend Configuration:**

Navigate to your `backend`/`websockets` directory and create a `.env` file:

```env
DATABASE_URL="your_database_connection_string"
JWT_SECRET="your_jwt_secret_key"
PORT=3001
```

**3. Install backend dependencies and sync the database:**

```bash
# From your backend directory
npm install
npx prisma db push      # Sync schema with the database
npx prisma generate     # Generate Prisma Client
```

**4. Install frontend dependencies:**

Navigate to your frontend directory:

```bash
npm install
```

---

## Running the Application

**Backend (WebSockets & Auth Server):**

```bash
# From your backend directory
npm run dev
```

The HTTP server will start on port `3001` and the WebSocket server on port `8080` (or as configured).

**Frontend:**

```bash
# From your frontend directory
npm run dev
```

Open the local address provided by Vite in your browser.
