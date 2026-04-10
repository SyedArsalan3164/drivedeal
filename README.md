# DriveDeal - Premium Dealership Platform

DriveDeal is a full-stack, production-ready MERN (MongoDB, Express, React, Node.js) application designed to modernize car dealerships. It provides a seamless, high-performance UI for clients to browse vehicle inventories, alongside a highly secured, data-rich administrative dashboard to manage leads and listings.

## Key Features

### Robust Security & Authentication
- **Secure Architecture:** Built using JWT (JSON Web Tokens) with HttpOnly cookies/authorization headers.
- **Two-Step Email Registration:** Prevents spam accounts by requiring a secure 6-digit OTP code sent via NodeMailer before client account creation.
- **Password Management:** Complete self-service forgot/reset password flows utilizing secure temporary cryptographic tokens.
- **API Rate Limiting:** Dedicated `express-rate-limit` configurations to prevent brute-force login attempts and spam newsletter subscriptions.

### Dual User Ecosystem
- **Client Portal:** Beautiful, animated frontend where users can browse inventory, view multi-image car galleries, subscribe to newsletters, and seamlessly request test-drives or call dealers directly.
- **Admin Dashboard:** A protected `role-based` portal allowing dealership employees to:
  - Add, edit, and delete car inventory listings.
  - Upload multiple high-res vehicle images simultaneously via `multer`.
  - View, manage, and track the status of arriving client inquiries.

### Automated CRM & Communications
- **Automated Alerts:** The system uses Mongoose triggers to auto-email all active newsletter subscribers the instant a new car is listed.
- **Subscription Management:** Users can instantly unsubscribe via secure database-linked hyperlinks inside their emails.
- **Dynamic Configuration:** Dealer phone numbers and contact emails stream directly from environment variables.

## Tech Stack

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

## Project Structure

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
