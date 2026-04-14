# AI Chatbot

Clone of ChatGPT-like chatbot interface with OpenRouter API using Supabase

<img width="1904" height="860" alt="image" src="https://github.com/user-attachments/assets/f4f627ce-1054-42bb-b60f-2b900987be74" />
<img width="1884" height="842" alt="image" src="https://github.com/user-attachments/assets/729be8ec-e349-42a1-947f-7e4bb7d92f6b" />
<img width="1896" height="858" alt="image" src="https://github.com/user-attachments/assets/7ad9cb2e-850e-45f0-b457-6fa88dc02b7a" />
<img width="1904" height="857" alt="image" src="https://github.com/user-attachments/assets/a7f1027b-d754-4bd3-8c3e-738a8638b87b" />
<img width="1887" height="860" alt="image" src="https://github.com/user-attachments/assets/0da7a741-fbfa-46f4-9ee3-e87095b02554" />
<img width="1899" height="854" alt="image" src="https://github.com/user-attachments/assets/b62fa37c-524e-4929-8d5e-6ac934835bef" />
<img width="1903" height="855" alt="image" src="https://github.com/user-attachments/assets/9a8e5634-3433-4bd0-853d-3364483e9f0c" />

## Features
- Send messages to chat and receive responses from LLM
- User authorization/sign-in
- Attach images to chat
- Synchronise new chats across tabs
- Upload documents(max 50KB) and use data for context

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
