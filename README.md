# Convoa

Convoa supports one-to-one conversations, group chats, real-time messaging, message history, user search, group management, and a responsive chat experience.

---

## Live Demo

### Part 1 — Chat Application

**Live URL:**
`https://convoa.vercel.app`

### Part 2 — Creative Landing Page

**Live URL:**
`https://convoa.vercel.app/landing`

---

## Repository

**GitHub:**
`https://github.com/jfemon8/convoa`

---

## Features

### Authentication

- Login with phone number and name
- Automatic registration for new phone numbers
- JWT-based authentication
- Session restoration after page refresh
- Protected and guest routes
- Bangladeshi mobile number validation

### Conversations

- Search users by name or phone number
- Start or open one-to-one conversations
- View all current conversations
- Direct and group conversations in the same chat interface
- Conversation-specific message history

### Messaging

- Send messages
- Prevent empty messages
- Real-time incoming messages through Socket.io
- Clear sender and receiver message styling
- Timestamped messages
- Automatic scrolling to the latest message
- Older message loading through pagination
- Mobile-friendly chat navigation

### Groups

- Create group conversations
- Add members
- Remove members
- Leave a group
- Promote members to admin
- Rename groups
- Group conversation updates in real time

### User Experience

- Loading states
- Empty states
- Error handling
- Responsive layout
- Toast notifications
- Smooth navigation
- Mobile master/detail chat flow

---

# Tech Stack

## Core

- React 19
- Vite
- React Router
- JavaScript

## Styling

- Tailwind CSS
- Lucide React

## API and Real-Time

- Axios
- Socket.io Client

## Utilities

- `clsx`
- `date-fns`
- `react-hot-toast`

---

# Getting Started

## Prerequisites

Make sure you have Node.js and npm installed.

You can check your versions with:

```bash
node -v
npm -v
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/jfemon8/convoa.git
```

Move into the project directory:

```bash
cd convoa
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://frontend-task-chatapp.onrender.com/api
VITE_SOCKET_URL=https://frontend-task-chatapp.onrender.com
```

The REST API uses the `/api` base path, while the Socket.io connection uses the server root.

---

## Run the Development Server

Start the application with:

```bash
npm run dev
```

The development server will normally be available at:

```text
http://localhost:5173
```

---

## Build for Production

Create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Lint

Run ESLint with:

```bash
npm run lint
```

---

# Project Structure

The project is organized by responsibility so that UI, API communication, authentication, and real-time features remain easy to maintain.

```text
src/
├── components/
│   ├── chat/
│   ├── conversation/
│   ├── group/
│   ├── layout/
│   └── ui/
│
├── constants/
│
├── context/
│   ├── AuthContext.jsx
│   └── SocketContext.jsx
│
├── hooks/
│
├── lib/
│   ├── api.js
│   └── socket.js
│
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── ChatPage.jsx
│   └── CreateGroupPage.jsx
│
├── services/
│   ├── auth.service.js
│   ├── user.service.js
│   ├── conversation.service.js
│   └── message.service.js
│
├── utils/
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# API Documentation

The API contract was documented separately in:

```text
API.md
```

It covers:

- Authentication
- User search
- Conversations
- Message history
- Group management
- Sending messages
- WebSocket events
- Request models

---

## Architecture and Approach

I chose React with Vite because the application has several interactive parts and I wanted a simple setup with fast development and a clear component structure. I used React Router for page and conversation navigation, Tailwind CSS for responsive styling, Axios for API communication, and Socket.io for real-time updates. I also used small supporting libraries such as `lucide-react`, `date-fns`, `clsx`, and `react-hot-toast` where they helped keep the interface clean and maintainable.

I kept the API logic separate from the UI by creating service and utility layers. Authentication is handled through a shared context, which keeps the current user and session state available across the application. I also used protected and guest routes so that authentication behavior stays separate from individual pages.

For real-time messaging, I used a shared Socket.io connection instead of creating a new socket for each conversation. This makes the connection lifecycle easier to manage and helps avoid duplicate listeners. The chat interface also keeps message state separate from the presentation components, which makes the message list and input easier to maintain.

One trade-off was keeping the architecture relatively lightweight. I considered adding a dedicated global state management library, but for this assignment it would have added more complexity than value. React state, context, custom hooks, and the API service layer were enough for the required features.

## Design Decisions

For the landing page, I wanted it to feel like a real product introduction rather than a standard template. I used a warm neutral background with dark text and a coral accent to give the page a distinctive visual identity while keeping the content easy to read.

The main hero section includes an interactive chat preview so the visitor can understand the product without leaving the landing page. Instead of using only screenshots, the preview allows a visitor to type and send a sample message, making the page feel more connected to the actual application.

The rest of the page focuses on the main strengths of the chat experience: real-time messaging, direct and group conversations, message history, and thoughtful interaction details such as scrolling and useful interface states. I also kept the layout responsive so that the same experience works across desktop, tablet, and mobile screens.

## AI Usage

I used AI tools during development as a development assistant rather than relying on them to produce the entire application. I used AI mainly for brainstorming, discussing architecture, reviewing implementation ideas, debugging issues, and helping organize the API documentation.

I also used AI when I was working through some setup and implementation problems, but I reviewed the suggestions and adapted them to fit the actual API and project structure. I did not treat generated code as final without testing it. Several suggestions were changed or simplified after comparing them with the actual API behavior and the requirements of the assignment.

The final structure, feature integration, UI decisions, API handling, and debugging were reviewed and adjusted as part of the implementation process.

## What I Would Improve

With more time, I would focus on a few areas beyond the current implementation. I would add more automated tests around authentication, message handling, real-time updates, and group actions. I would also improve some edge cases around network failures, reconnecting the WebSocket, and handling larger message histories.

I would also spend more time refining accessibility details, keyboard interactions, and smaller mobile-screen behaviors. From a product perspective, features such as richer message actions, attachments, read states, and more advanced notification behavior could be added later.

Overall, I focused on delivering a working chat experience with a clean structure, clear user flow, responsive design, and a landing page that reflects the actual product rather than simply presenting a collection of generic sections.
