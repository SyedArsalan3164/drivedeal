# 🚗 DriveDeal - Premium Dealership Platform

DriveDeal is a full-stack, production-ready MERN (MongoDB, Express, React, Node.js) application designed to modernize car dealerships. It provides a seamless, high-performance UI for clients to browse vehicle inventories, alongside a highly secured, data-rich administrative dashboard to manage leads and listings.

## ✨ Key Features

### 🛡️ Robust Security & Authentication
- **Secure Architecture:** Built using JWT (JSON Web Tokens) with HttpOnly cookies/authorization headers.
- **Two-Step Email Registration:** Prevents spam accounts by requiring a secure 6-digit OTP code sent via NodeMailer before client account creation.
- **Password Management:** Complete self-service forgot/reset password flows utilizing secure temporary cryptographic tokens.
- **API Rate Limiting:** Dedicated `express-rate-limit` configurations to prevent brute-force login attempts and spam newsletter subscriptions.

### 👥 Dual User Ecosystem
- **Client Portal:** Beautiful, animated frontend where users can browse inventory, view multi-image car galleries, subscribe to newsletters, and seamlessly request test-drives or call dealers directly.
- **Admin Dashboard:** A protected `role-based` portal allowing dealership employees to:
  - Add, edit, and delete car inventory listings.
  - Upload multiple high-res vehicle images simultaneously via `multer`.
  - View, manage, and track the status of arriving client inquiries.

### ✉️ Automated CRM & Communications
- **Automated Alerts:** The system uses Mongoose triggers to auto-email all active newsletter subscribers the instant a new car is listed.
- **Subscription Management:** Users can instantly unsubscribe via secure database-linked hyperlinks inside their emails.
- **Dynamic Configuration:** Dealer phone numbers and contact emails stream directly from environment variables.

## 💻 Tech Stack

**Frontend:**
* React 18 (Bootstrapped with Vite for instant HMR)
* TypeScript (Strict type enforcement across data layers)
* TailwindCSS (Responsive, utility-first styling)
* Lucide React (Premium iconography)
* React Router v6 & React Hot Toast

**Backend:**
* Node.js & Express.js REST API
* MongoDB & Mongoose ORM
* JWT (JsonWebToken) & BcryptJS
* NodeMailer (SMTP Email Automation)
* Multer (Multipart/form-data for image uploads)

## 📁 Project Structure

```text
drivedeal/
├── backend/                  # Node.js Express Server
│   ├── src/                  
│   │   ├── controllers/      # Route logic (Auth, Cars, Newsletter, Requests)
│   │   ├── middleware/       # JWT Auth verification, Rate limiters, Multer
│   │   ├── models/           # Mongoose Schemas (User, Car, Subscriber, Request)
│   │   └── routes/           # API Endpoint definitions
│   ├── uploads/              # Local server image storage
│   └── server.js             # Express application initialization
│
└── frontend/                 # Vite React Application
    ├── src/
    │   ├── admin/            # Protected Dashboard Components
    │   ├── components/       # Reusable UI (Navbar, Footer, Modals)
    │   ├── pages/            # Public Pages (Inventory, Login, Signup)
    │   └── data/             # TypeScript interfaces
    └── tailwind.config.js    # Utility configurations
```

## 🚀 Getting Started (Local Development)

### 1. Requirements
- Node.js (v18+ recommended)
- Local MongoDB instance or Atlas URI

### 2. Backend Initialization
```bash
cd backend
npm install
```
Create a `.env` file in the `/backend` root with:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/drivedeal
JWT_SECRET=your_jwt_secret_key
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
ADMIN_NAME="Your Name"
ADMIN_EMAIL="admin@domain.com"
ADMIN_PASSWORD="supersecretpassword"
```
```bash
npm run dev
# Tip: Run 'node seedAdmin.js' once to generate your initial Admin credentials!
```

### 3. Frontend Initialization
```bash
cd frontend
npm install
```
Create a `.env` file in the `/frontend` root with:
```env
VITE_API_URL=http://localhost:5000/api
VITE_DEALER_PHONE=9876543210
VITE_DEALER_EMAIL=contact@drivedeal.com
```
```bash
npm run dev
```

## 🤝 Contribution & Deployment
This repository is configured with optimal `.gitignore` profiles to safely prevent any `.env` leakages. To push to production (e.g. Render/Vercel), simply map exactly the environment variables listed above into your platform dashboard!
