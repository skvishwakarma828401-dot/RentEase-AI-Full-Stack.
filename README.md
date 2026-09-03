# RentEase AI — Smart AI Furniture Rental & Buying Full-Stack Platform

[![Live Project Report](https://img.shields.io/badge/Project%20Report-View%20Documentation-0284c7?style=for-the-badge&logo=googledocs&logoColor=white)](https://github.com/skvishwakarma828401-dot/RentEase-AI-Full-Stack./blob/main/PROJECT_REPORT.md)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/skvishwakarma828401-dot/RentEase-AI-Full-Stack.)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E=18.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)

A production-grade, full-stack rental commerce and spatial recommendation platform built with Node.js, Express, MongoDB, Vanilla JavaScript, and OpenAI.

---

## 📑 Official Project Report & Valid Links

Share these direct, verified HTTPS URLs with interviewers, stakeholders, or team members:

* **Official Detailed Project Report**: [https://github.com/skvishwakarma828401-dot/RentEase-AI-Full-Stack./blob/main/PROJECT_REPORT.md](https://github.com/skvishwakarma828401-dot/RentEase-AI-Full-Stack./blob/main/PROJECT_REPORT.md)
* **GitHub Source Repository**: [https://github.com/skvishwakarma828401-dot/RentEase-AI-Full-Stack.](https://github.com/skvishwakarma828401-dot/RentEase-AI-Full-Stack.)
* **Raw Markdown Project Report**: [https://raw.githubusercontent.com/skvishwakarma828401-dot/RentEase-AI-Full-Stack./main/PROJECT_REPORT.md](https://raw.githubusercontent.com/skvishwakarma828401-dot/RentEase-AI-Full-Stack./main/PROJECT_REPORT.md)
* **Interactive Web Report**: Accessible within the app at `/report.html` ([view code on GitHub](https://github.com/skvishwakarma828401-dot/RentEase-AI-Full-Stack./blob/main/frontend/report.html))

---

## 🌟 Key Features

1. **AI Natural-Language Assistant**: Translates plain English furnishing requests into database queries without AI hallucination.
2. **Real-Time AR Camera Scanner**: Analyzes room photos and dimensions via the browser camera to recommend customized furniture bundles.
3. **150-Item Multi-Category Catalog**: Sofas, beds, study desks, ergonomic chairs, dining tables, and wardrobes.
4. **Indian PIN Code Eligibility Engine**: Real-time serviceability checks with 24-48h express delivery and free doorstep assembly.
5. **Customer Reviews & Star Ratings**: Verified community ratings, helpfulness votes, and instant review submissions.
6. **Tiered Tenure Discounts**: Up to 35% discount for 24-month tenures, plus 50% refundable security deposit.
7. **Rent-to-Own Buyout Engine**: Automatically calculates residual ownership cost, converting past rent into asset equity.
8. **Digital Paperless KYC**: Instant submission and verification of Aadhaar, PAN, Passport, or DL.
9. **1-Click GST Tax Invoices**: Generates compliant 18% GST (CGST + SGST) tax receipts ready to print/download.
10. **Role-Based Admin Dashboard**: Live sales analytics, revenue tracking, inventory management, and fulfillment status updating.
11. **Responsive Light & Dark Modes**: Complete accessibility across iPhones, iPads, Android, laptops, and ultra-wide displays.
12. **High-Availability Hybrid Engine**: Connects to MongoDB Atlas when available, with zero-downtime offline fallback to a 150-item dataset.

---

## 🏗️ Architecture & Data Flow

```
User Natural Language Request
  │
  ▼
POST /api/ai/recommend (or /api/ai/chat)
  │
  ▼
AI Model / Regex NLP extracts: category, budget, room size
  │
  ▼
Backend sanitizes & validates parameters against schema
  │
  ▼
MongoDB / In-Memory Store queries real inventory matching criteria
  │
  ▼
Express returns validated JSON payload to client
  │
  ▼
Client renders responsive product cards & recommendations
```

*Note: The AI acts solely as a semantic filter. MongoDB remains the authoritative source of truth, guaranteeing zero hallucinated inventory.*

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
Create a `.env` file in the root:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/rentease
JWT_SECRET=super_secret_jwt_key_rentease_123456
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```
*(If `OPENAI_API_KEY` is left blank, the built-in deterministic NLP engine automatically handles requests).*

### 3. Seed Catalog
```bash
npm run seed
```

### 4. Start Application
```bash
npm run dev
# or production:
npm start
```
Open **http://localhost:5000** in your browser.

---

## 🛡️ Default Demo Credentials

* **Admin Portal**: Email: `admin@rentease.com` | Password: `admin123`
* **Customer**: Register any email via the web interface or use guest browsing.

---

## 📄 Documentation

For full system architecture, database ER models, and complete REST API tables, review the **[Official Project Report](https://github.com/skvishwakarma828401-dot/RentEase-AI-Full-Stack./blob/main/PROJECT_REPORT.md)**.
