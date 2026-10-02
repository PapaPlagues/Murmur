# Murmur

Murmur is a private, one-to-one messaging app for connecting people through direct conversations. The project brings together a responsive React client, an authenticated Express API, PostgreSQL persistence, and hosted image uploads.

[Live Demo →](https://murmur-sable.vercel.app/)

## About the Project

Murmur was built as a hands-on full-stack project to explore what goes into building and deploying a complete messaging application from the ground up.

Rather than focusing only on the chat interface, I wanted to build the surrounding systems that make a messaging app feel complete: authentication, user profiles, conversations, image uploads, presence, relational data, responsive layouts, and a production deployment.

The project gave me an opportunity to work across the entire stack—from designing React interfaces and managing client state to building an authenticated Express API, modeling relationships with Prisma, handling media uploads, and connecting the application to a production PostgreSQL database.

## Key Features

- **Authentication** — Register, log in, log out, restore authenticated sessions, and access a configured guest/demo account.
- **One-to-one messaging** — Start conversations with other users and exchange text messages.
- **Image attachments** — Upload and display images directly within conversations.
- **User profiles** — Browse users, view profiles, and start conversations from a user's profile.
- **Profile editing** — Update usernames, display names, bios, avatars, and profile banners.
- **Presence** — Track online status through periodic presence heartbeats and last-seen timestamps.
- **Conversation ordering** — Keep the most recently active conversation at the top of the conversation list.
- **Responsive UI** — Adapt the conversation, profile, and user interfaces for smaller screens and mobile viewports.
- **Protected routes** — Restrict authenticated application areas while keeping authentication pages publicly accessible.

## Tech Stack

### Frontend

- **React 19** — UI development
- **Vite 8** — Development and production build tooling
- **React Router** — Client-side routing and protected routes
- **Tailwind CSS 4** — Styling and responsive layouts
- **Zustand** — Client-side state management

### Backend

- **Node.js**
- **Express 5** — REST API
- **PostgreSQL** — Relational database
- **Prisma** — ORM and database migrations
- **Cloudinary** — Image storage and delivery

## Libraries & Tools

- **UI:** Base UI, shadcn component tooling, Lucide icons, Geist Variable font, `class-variance-authority`, `clsx`, and `tailwind-merge`.
- **API and security:** `cors`, `cookie-parser`, `helmet`, `express-rate-limit`, `jsonwebtoken`, and `bcryptjs`.
- **Uploads:** `multer` for multipart form handling and `file-type` for checking uploaded image contents.
- **Database:** Prisma CLI and client, `@prisma/adapter-pg`, and `pg`.
- **Development and tests:** ESLint, Prettier, Nodemon, Vitest, and Supertest.

## Screenshots

A look at Murmur's main features and responsive interface.

### Authentication

![Murmur login page](docs/screenshots/login-page.png)

### Messaging

The main messaging interface, including conversations, message history, and image attachments.

![Murmur messaging interface](docs/screenshots/home-messaging.png)

### Profiles

Users can customize their profiles with avatars, banners, bios, and account information.

| Profile | Edit Profile |
|---|---|
| ![Murmur profile](docs/screenshots/profile.png) | ![Murmur edit profile](docs/screenshots/edit-profile.png) |

### Discovering Users

Users can browse other accounts, view profiles, and start conversations.

![Murmur people list and user profile](docs/screenshots/people-and-userprofile.png)

### Responsive Design

Murmur adapts its interface for smaller screens and mobile viewports.

![Murmur mobile interface](docs/screenshots/mobile-responsive.png)

## How It Works

Murmur is split into a React frontend and an Express backend, with PostgreSQL handling persistent data and Cloudinary handling image storage.

### Architecture

```text
┌─────────────────────┐
│      React / Vite   │
│      Frontend       │
│       Vercel        │
└──────────┬──────────┘
           │
           │ HTTP
           │ HttpOnly JWT Cookie
           ▼
┌─────────────────────┐
│     Express API     │
│       Render        │
└───────┬───────┬─────┘
        │       │
        ▼       ▼
┌───────────┐ ┌────────────┐
│ PostgreSQL│ │ Cloudinary │
│   Neon    │ │   Images   │
└───────────┘ └────────────┘
```

The React client communicates with the Express API over HTTP. Authentication uses JWTs stored in an HTTP-only cookie, allowing protected API routes to identify the current user without exposing the token to client-side JavaScript.

Prisma handles database access and migrations, with PostgreSQL storing users, conversations, messages, profile information, and image URLs.

For image uploads, the API receives the file in memory, validates its detected file type, and sends it to Cloudinary. The resulting URL is stored with the associated database record.

Presence is handled through periodic HTTP heartbeats and last-seen timestamps. Messaging currently uses the REST API rather than a WebSocket connection.

## Local Development

### Requirements

- Node.js and npm
- A PostgreSQL database for development
- A Cloudinary account for message and profile image uploads

### Setup

1. Install the client and server dependencies:

   ```sh
   cd client
   npm install
   cd ../server
   npm install
   ```

2. Create `server/.env` from `server/.env.example`.

   Configure the following values:

   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_secret
   DEV_FRONTEND_URL=http://localhost:5173

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   `PORT` can be set to `3000` or omitted to use the server default.

   On PowerShell, use:

   ```powershell
   Copy-Item .env.example .env
   ```

   instead of:

   ```sh
   cp .env.example .env
   ```

3. From the `server` directory, apply the development migrations:

   ```sh
   npm run prisma:migrate
   ```

4. Create `client/.env` from `client/.env.example` and set the local API URL:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

5. Start the API and client in separate terminals:

   ```sh
   cd server
   npm run dev
   ```

   ```sh
   cd client
   npm run dev
   ```

   Vite uses `http://localhost:5173`; the API defaults to `http://localhost:3000`.

### Testing

The backend test suite uses Vitest and Supertest.

Configure `TEST_DATABASE_URL` in `server/.env` with a separate PostgreSQL test database, then run:

```sh
cd server
npm test
```

The test setup applies the existing Prisma migrations to the test database before running the tests.

To create a production client build:

```sh
cd client
npm run build
```

## Production Deployment

Murmur is deployed with:

| Service | Purpose |
|---|---|
| **Vercel** | React frontend |
| **Render** | Express API |
| **Neon** | Production PostgreSQL |
| **Cloudinary** | Image storage |

The Vercel frontend uses `VITE_API_URL` to communicate with the deployed Express API. The Express API connects to Neon through `DATABASE_URL` and uses Cloudinary for uploaded images.

The client includes a Vercel rewrite configuration so React Router routes resolve correctly when users navigate directly to or refresh application URLs.

Production database migrations are applied with:

```sh
npm run prisma:migrate:deploy
```

Production secrets and database credentials are stored in the hosting providers' environment variables and are not committed to the repository.

## What I Learned

Building Murmur gave me hands-on experience across the full lifecycle of a web application.

The project covers several practical full-stack concepts, including:

- Building a React application with reusable components and client-side routing
- Managing shared application state with Zustand
- Building REST API endpoints with Express
- Protecting API routes with cookie-based JWT authentication
- Modeling relational data and applying migrations with Prisma and PostgreSQL
- Validating multipart image uploads
- Integrating Cloudinary for external media storage
- Managing CORS and credentialed requests between a separately hosted client and API
- Building responsive layouts for desktop and mobile
- Writing API and integration tests with Vitest and Supertest
- Deploying and connecting a frontend, backend, database, and external storage service in production

## Future Improvements

Some areas I would explore in a future version:

- Add WebSocket-based delivery for new messages and presence updates
- Add read receipts, typing indicators, and delivery state
- Add message pagination and conversation history search
- Add group conversations and controls for managing conversation membership

---

**Murmur** is a project focused on learning by building—taking a feature from the UI all the way through the API, database, external services, and production deployment.
