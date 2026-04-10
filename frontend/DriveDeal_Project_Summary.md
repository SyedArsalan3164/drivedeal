# DriveDeal Project Summary (Viva Preparation Guide)

This document provides a comprehensive technical overview of the **DriveDeal** project, designed to help you prepare for your upcoming project viva.

## 1. Project Overview
**DriveDeal** is a full-stack web application for a modern car dealership. It serves as both a customer-facing platform for browsing vehicle inventory and an administrative backend for managing car listings, handling client inquiries, and tracking sales requests. 

The project recently transitioned from a static frontend mockup to a fully dynamic, database-driven application.

---

## 2. Technology Stack
The application is built using a modern JavaScript/TypeScript ecosystem (MERN-like stack, but substituting React with Vite + TS).

### Frontend (Client-Side)
- **Framework:** React 19 with Vite (for fast bundling and HMR).
- **Language:** TypeScript (`.tsx` files) for type safety.
- **Styling:** Tailwind CSS for utility-first, responsive design.
- **Routing:** React Router v7 (`react-router-dom`) for SPA navigation.
- **State Management:** React Context API (`DataContext.tsx` & `AuthContext.tsx`).
- **Icons & UI:** Lucide React for consistent SVG icons, React Hot Toast for notifications.

### Backend (Server-Side)
- **Runtime:** Node.js
- **Framework:** Express.js (RESTful API development).
- **Database:** MongoDB (NoSQL database).
- **ODM (Object Data Modeling):** Mongoose.
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs for password hashing.
- **File Uploads:** Multer (handling multipart/form-data for multiple car images).

---

## 3. System Architecture & Flow

The app follows a standard client-server architecture:
1. **Client (React):** Sends HTTP requests (GET, POST, PUT, DELETE) to the backend. Includes JWT in the `Authorization` header for protected routes.
2. **Server (Express):** Receives requests, applies middleware (CORS, JSON parsing, Auth verification), and interacts with the MongoDB database using Mongoose models.
3. **Database (MongoDB):** Stores persisting data. Documents are structured flexibly but enforced via Mongoose schemas.

---

## 4. Database Schema (Mongoose Models)

The database consists of three primary collections:

### A. User Model (`User.js`)
Handles authentication and authorization.
- `name`, `email` (unique), `password` (hashed).
- `role`: Enum `['user', 'admin']` (defaults to 'user').

### B. Car Model (`Car.js`)
Stores the vehicle inventory.
- **Core Info:** `brand`, `model`, `year`, `price`, `mileage`, `location`, `description`.
- **Specs:** `fuelType` (Petrol, Diesel, Electric, Hybrid), `transmission` (Manual, Automatic).
- **Media:** `images` (Array of Strings containing file paths/URLs).
- **Status:** `status` (Available, Sold).

### C. ClientRequest Model (`ClientRequest.js`)
Acts as a mini-CRM for inquiries.
- **Client Info:** `clientName`, `phone`.
- **Reference:** `carId` (References the `Car` model). Fallback fields (`vehicleBrand`, `vehicleModel`, `vehiclePrice`) are used to retain inquiry context even if the original car is deleted.
- **Details:** `visitDate`, `message`.
- **State:** `status` (Pending, Contacted).

---

## 5. Key Features

### Authentication & Authorization
- Secure login and registration.
- Route protection based on User roles (only Admins can access `/admin/*` routes).

### Vehicle Inventory Management (Admin)
- Admins can **Add, Edit, and Delete** car listings (`ManageCars.tsx`, `AddCar.tsx`).
- **Multi-Image Uploads:** The backend `uploadRoutes.js` uses Multer to accept arrays of images, saving them locally to an `/uploads` directory and serving them statically.

### Client Inquiry System (CRM)
- Customers browsing the frontend can request private viewings or contact the dealership regarding specific cars.
- **Admin Dashboard (`ClientRequests.tsx`):** Admins view inquiries in a table format. They can see the vehicle of interest and mark the request status as "Contacted".
- **Robust Data Handling:** If a car is sold and deleted from the database, the dashboard gracefully falls back to showing the cached vehicle brand and model, preventing UI crashes.

---

## 6. Potential Viva Questions & Answers

**Q: Why did you choose MongoDB over a SQL database like MySQL?**
> **A:** MongoDB provides a flexible schema design, which is excellent for handling dynamic attributes (like varying car features or an array of image URLs). It also pairs perfectly with Node.js/Express, allowing us to use JSON across the entire stack.

**Q: How is authentication handled in this application?**
> **A:** We use JSON Web Tokens (JWT). Upon successful login, the server generates a token and sends it to the client. The frontend stores this token and includes it in the HTTP headers of subsequent API requests to access protected endpoints. Passwords are never stored in plain text; they are hashed using `bcryptjs`.

**Q: How do you handle file (image) uploads?**
> **A:** Image uploads are handled by the `multer` middleware on the Node.js backend. When an admin creates a car listing with photos, the frontend sends a `multipart/form-data` request. Multer intercepts this, saves the files to the local `uploads` directory, and the paths are saved in the MongoDB `Car` document.

**Q: What happens to a client's inquiry if the car they inquired about gets deleted from the database?**
> **A:** In the `ClientRequest` schema, alongside the `carId` reference, we store fallback data like `vehicleBrand`, `vehicleModel`, and `vehiclePrice`. In the frontend (`ClientRequests.tsx`), we check if the car object exists when rendering. If it returns null, we use the fallback strings and render a "Deleted Vehicle" badge, ensuring the admin doesn't lose the context of the inquiry.
