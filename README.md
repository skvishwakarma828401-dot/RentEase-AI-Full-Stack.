# RentEase AI — Full Stack Furniture Rental Website

A portfolio/interview-ready full-stack furniture rental project built with:
- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Authentication: JWT + bcryptjs
- AI: OpenAI API (optional; demo fallback works without an API key)
- API style: REST

## Features
- Product catalog with search/category filters
- User registration/login
- JWT authentication
- Cart
- Rental/order creation
- User orders
- AI Furniture Assistant
- Natural-language recommendation flow:
  User -> Express -> AI -> MongoDB -> recommendations -> frontend
- Admin-friendly product creation API

## 1. Install

Open a terminal in `backend`:

```bash
npm install
```

## 2. Configure environment

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/rentease
JWT_SECRET=change_this_to_a_long_random_secret
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

If you don't have an AI API key yet, leave `OPENAI_API_KEY` empty. The AI assistant will use a local demo parser so the website still works.

## 3. Seed products

```bash
npm run seed
```

## 4. Start backend

```bash
npm run dev
```

The API runs at:

`http://localhost:5000`

The frontend is served by Express at:

`http://localhost:5000`

## Demo accounts

You can register a new account from the website.

## Interview explanation

The important architecture is:

User natural-language request
-> POST /api/ai/recommend
-> AI extracts category/budget/room preference
-> backend validates the extracted filters
-> MongoDB finds real products
-> backend returns real product records
-> frontend renders recommendation cards

The AI never invents inventory. MongoDB remains the source of truth.
