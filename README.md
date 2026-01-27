![Discord Clone Banner](banner.png)

# Modern Discord Clone (Next.js 15 Architecture)

![Status](https://img.shields.io/badge/Status-Active_Development-green)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-teal)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan)

> 🚧 **Project Status:** This project is currently under **active development**.
> I am pushing code daily. Feel free to check the [Commit History](https://github.com/shmuelmekonen/discord-clone/commits/main) to see my latest work on Real-time architecture!

A full-stack Discord clone application built with modern web technologies. This project focuses on **performance**, **type-safety**, and **scalable architecture**.

It features real-time server management, granular role-based permissions, and a robust database schema.

---

## ⚡ Key Improvements & Refactoring

While inspired by a popular tutorial, this project represents a **significant architectural upgrade** to modern standards (Next.js 15).
Major improvements I implemented:

- **Hybrid Backend Architecture:**
- **Server Actions:** Used for 90% of the app (CRUD operations, Server creation, Member management) to ensure type safety and reduced API overhead.
- **Custom Socket Layer:** Strategically used `pages/api` for the WebSocket server to gain access to the global `res.socket` instance, enabling true bi-directional communication (which is currently limited in Server Actions).
- **Type-Safe Data Mutation:** Implemented end-to-end type safety using **Zod** validation on both client forms (React Hook Form) and server endpoints.
- **Next.js 15 Compatibility:** Upgraded codebase to handle Next.js 15 breaking changes, such as `Promise`-based params in Layouts and Pages (`await params`).
- **Structured Error Handling:** Designed a custom `ActionResponse` pattern to standardize error management across the app, replacing generic HTTP status codes.

---

## 🚀 Tech Stack & Features

### Core

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/) / Local)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)

### Services

- **Auth:** [Clerk](https://clerk.com/) (User management & Middleware)
- **Uploads:** [UploadThing](https://uploadthing.com/) (Server icons & Attachments)

---

## 🗺️ Roadmap & Progress

Current implementation status:

- [x] **Authentication System** (Clerk Integration)
- [x] **Server Management** (Create, Edit, Delete with Invite Codes)
- [x] **Channel Management** (Text, Audio, Video channel types)
- [x] **Role & Permissions** (Guest, Moderator, Admin roles)
- [x] **Member Management** (Kick, Change Role)
- [x] **Chat Interface** (Type-safe Chat Input with Zod Validation)
- [x] **Robust Error Handling** (Server Actions + Toast Notifications)
- [ ] **Real-time Messaging** (Socket.io Backend integrated, UI in progress) 🚧
- [ ] **Voice & Video Architecture** (Evaluating LiveKit / WebRTC) 🔜 _Next Step_
- [ ] **Direct Messages** (1:1 conversations)

---

## 🛠️ Local Development

If you want to clone and run this project locally to test the features:

### 1. Clone the repository

```bash
git clone https://github.com/shmuelmekonen/discord-clone.git
cd discord-clone
```

### 2. Install dependencies

```bash
npm install

```

### 3. Set up environment variables

Create a `.env` file in the root directory with your keys (Clerk, UploadThing, Database).

### 4. Setup Database

```bash
npx prisma generate
npx prisma db push

```

### 5. Run the server

```bash
npm run dev

```

---

## 🎨 Architecture Highlights

- **Server Actions:** I explicitly chose Server Actions for data mutation to leverage Next.js caching and revalidation features. However, for the Chat System, I implemented a custom Axios + API Route pattern to handle the persistent Socket.IO connection efficiently.
- **Optimized Rendering:** Utilizing `router.refresh()` for server-state synchronization instead of complex client-side state management.
- **Component Modularity:** All modals (Create Server, Edit Channel, etc.) are decoupled and managed via a global Modal Provider.

---

### 🤝 Credits

This project was initially inspired by [Code with Antonio](https://www.youtube.com/watch?v=ZbX4Ok9YX94). I have heavily modified the codebase to align with Next.js 15 Best Practices, improved the error handling strategies, and refactored the state management approach.

---

### Author

**Shmuel Mekonen** - _Full Stack Developer_
