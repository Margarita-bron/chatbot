# AI Chatbot

Clone of ChatGPT-like chatbot interface with OpenRouter API using Supabase

## Features
- Send messages to chat and receive responses from LLM
- User authorization/sign-in
- Attach images to chat
- Synchronise new chats across tabs
- Upload documents and use data for context

## Stack
- Client-side: ReactJS
- UI: TailwindCSS
- Server-side: Node.js Express REST API Server
- Database: Postgres via Supabase (DB + Storage for uploads)
- Auth: Supabase
- Realtime updates: Supabase Realtime
- API: OpenRouter API(openai models)

##  Using
```javascript
cd server
npm run devv

cd client
npm run dev
