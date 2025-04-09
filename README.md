# 🗨️ Real-Time Chat App

A modern, real-time chat application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **React Query**, **Redux Toolkit**, and **Ably** for real-time messaging.

## 🚀 Features

- 🔐 **Authentication** with NextAuth (OAuth2 + Session Management)
- 🧑‍🤝‍🧑 **Multi-user Conversations** (1-on-1 & Group Chats)
- ✉️ **Real-time Messaging** with Ably Channels
- 💬 **Message Features**:
  - Edit and Delete Messages
  - Hover menu for message actions
  - Paginated messages with infinite upward scroll
- 🧵 **Chat Management**:
  - Chat list with infinite scroll (latest first)
  - Create new chats with selected participants
- 🔄 **State Management** with Redux Toolkit & Entity Adapters
- ⚡ **Caching & Pagination** with React Query
- 🧰 **PostgreSQL** for persistent storage (via Vercel Postgres)
- 🛠️ Full **API Route support** for:
  - Messages (`GET`, `POST`, `PUT`, `DELETE`)
  - Chats (`GET`, `POST`, `DELETE`)
  - Users (`POST` for lookup)
- 👤 User avatars and names displayed using session and cached user info

## 📦 Tech Stack

| Tech                  | Purpose                               |
|-----------------------|---------------------------------------|
| **Next.js 14**        | React framework & server components   |
| **TypeScript**        | Type safety                           |
| **Tailwind CSS**      | Utility-first styling                 |
| **Redux Toolkit**     | Global state management               |
| **React Query**       | Server state & caching                |
| **Ably**              | Real-time pub/sub messaging           |
| **PostgreSQL (Vercel)** | Persistent storage                 |
| **NextAuth**          | Authentication & session handling     |
| **Axios**             | HTTP requests                         |
| **UUID**              | Unique ID generation for entities     |
| **MUI**               | UI components (inputs, icons, etc)    |

## 📌 Future Enhancements

- File uploads & image attachments
- Delivery/read receipts
- Online presence indicators
- Typing indicators
- Message reactions
- Dynamic unread message count
