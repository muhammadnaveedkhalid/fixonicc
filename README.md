# 🔧 Fixonic - Advanced Device Repair & Services Platform

> **Final Year Project (FYP)**  
> **Stack:** MERN (MongoDB, Express.js, React.js, Node.js)

Fixonic is a comprehensive, full-stack web application designed to modernize the device repair industry. It bridges the gap between customers needing urgent device repairs and skilled vendors/technicians. Beyond repairs, Fixonic features a robust e-commerce module for accessories, a tech blog, and a dynamic content management system (CMS).

The platform is built with a focus on **User Experience (UX)**, **Performance**, and **Scalability**, utilizing a microservices-inspired architecture within a monolithic repo for easier deployment on Vercel.

---aaa

## 📑 Table of Contents
1.  [Project Overview](#-project-overview)
2.  [Key Features](#-key-features)
    *   [User Module](#customer-module)
    *   [Vendor Module](#vendor-module)
    *   [Admin Module](#admin-module)
    *   [Repair Tracking System](#-repair-tracking-system)
3.  [Technical Architecture](#-technical-architecture)
4.  [Technology Stack](#-technology-stack)
5.  [Folder Structure](#-folder-structure)
6.  [Installation & Setup](#-installation--setup)
7.  [Environment Variables](#-environment-variables)
8.  [API Documentation](#-api-documentation)

---

## 🚀 Project Overview

The primary goal of Fixonic is to provide a seamless, transparent, and efficient way to book and track electronic repairs.
*   **For Customers:** A hassle-free booking wizard, real-time status updates, and a marketplace for accessories.
*   **For Vendors:** A dedicated dashboard to manage assigned jobs, update repair statuses, and track earnings.
*   **For Admins:** Total control over the platform, including user management, content moderation, and financial oversight.

---

## ✨ Key Features

### 👤 Customer Module
*   **Smart Repair Wizard**: A 3-step interactive form to book repairs:
    1.  **Select Device**: Mobile, Laptop, or Desktop.
    2.  **Device Details**: Dynamic brand and model selection.
    3.  **Issue Reporting**: Upload images/videos of the defect and describe the issue.
*   **Real-Time Tracking**: Visual progress bar tracking repair status from 'Pending' to 'Completed'.
*   **E-Commerce Store**: 
    *   Filter accessories by category (Mobile, Laptop, Tablet).
    *   Add to cart and secure checkout.
    *   Order history and invoice generation.
*   **Vendor Directory**: Browse and view detailed profiles of available repair technicians.
*   **User Dashboard**: Central hub for managing active repairs, order history, and profile settings.

### 🛠 Vendor Module
*   **Job Board**: View available repair requests assigned by the Admin or direct bookings.
*   **Status Management**: Update repair stages (Accepted, On the Way, Repairing, Ready, Completed).
*   **Profile Management**: Update skills, shop location, and availability status.
*   **Earnings Tracker**: Visual charts (Recharts) showing completed jobs and revenue.

### ⚡ Admin Module
*   **Super Admin Dashboard**: Detailed analytics on Users, Revenue, Active Repairs, and System Health.
*   **User Management**: create, edit, delete, or ban Users/Vendors.
*   **Content Management System (CMS)**:
    *   **Landing Page Editor**: Edit Hero section, Stats, and Testimonials directly from the dashboard.
    *   **Blog Manager**: Publish and edit tech articles.
    *   **Brand & Model Manager**: Add new supported devices to the system dynamically.
*   **Repair Moderation**: Assign generic requests to specific vendors.
*   **Order Management**: Process shop orders and update easy shipment statuses.

### 🔄 Repair Tracking System
The core of Fixonic is its state-driven repair workflow:
1.  **Pending**: Request submitting by user.
2.  **Accepted**: Administrator or Vendor reviews and accepts the job.
3.  **On The Way**: Retrieval team is en route (for pickup services).
4.  **In Progress**: Device is currently being repaired.
5.  **Ready**: Repair finished, pending delivery/pickup.
6.  **Completed**: Device returned to owner.
7.  **Rejected**: Request declined (reason provided).

---

## 🏗 Technical Architecture

### **Frontend**
*   **SPA (Single Page Application)** built with **React 19** and **Vite**.
*   **Styling**: **Tailwind CSS** for a responsive, mobile-first design.
*   **State Management**: React **Context API** (AuthContext, DataContext, CartContext) minimizes prop drilling.
*   **Routing**: **React Router v7** handling protected routes (Admin/Vendor guards).
*   **HTTP Client**: Native `fetch` API via custom hooks.

### **Backend**
*   **REST API**: Built with **Express.js** and **Node.js**.
*   **Database**: **MongoDB** (Atlas) using **Mongoose** ODMs for schema validation.
*   **Authentication**: Stateless **JWT** (JSON Web Tokens) with HttpOnly cookies/Storage.
*   **Middleware**: Custom `authMiddleware`, `adminMiddleware`, `errorHandlers`.
*   **File Storage**: **Cloudinary** integration via `multer-storage-cloudinary` for optimizing and hosting user uploads.
*   **Email**: **Nodemailer** for transactional emails (Welcome, Order Confirmation, Repair Updates).

---

## 💻 Technology Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | React.js (v19) | Component-based UI |
| | Tailwind CSS (v3.4) | Styling & Responsive Design |
| | Vite (v6) | Build Tool & Dev Server |
| | Lucide React | Modern Screen Icons |
| | Recharts | Data Visualization (Charts) |
| **Backend** | Node.js (v20+) | JavaScript Runtime |
| | Express.js (v5) | API Framework |
| | MongoDB & Mongoose | NoSQL Database |
| | Socket.io | Real-time features (Chat/Notifications) |
| **Services** | Cloudinary | Image & Video Cloud Storage |
| | Nodemailer | Email Delivery Service |
| | JWT & Bcrypt | Security & Auth |

---

## 📂 Folder Structure

### **Client (`/src`)**
```
src/
├── components/          # Reusable UI components (Navbar, Modal, Table, etc.)
├── context/             # Global State Providers (Auth, Data, Cart)
├── data/                # Static assets and constants
├── pages/               # Application Views
│   ├── admin/           # Admin Dashboard & CMS Pages
│   ├── auth/            # Login, Register, Forgot Password
│   ├── client/          # User Dashboard & Order History
│   ├── landing/         # Public Landing Page Sections
│   ├── vendor/          # Vendor Dashboard & Analytics
│   └── ...              # Public pages (Shop, Services, Contact)
├── App.jsx              # Main Router Configuration
└── main.jsx             # Entry Point & Providers
```

### **Server (`/server`)**
```
server/
├── config/              # DB Connection & Cloudinary Config
├── controllers/         # Request Handlers (Logic Layer)
│   ├── authController.js
│   ├── repairController.js
│   └── ...
├── middleware/          # Auth checks & Error handling
├── models/              # Mongoose DB Schemas
├── routes/              # API Route Definitions
├── utils/               # Helper functions (Token generation, Email)
├── index.js             # Server Application Entry Point
└── vercel.json          # Deployment configuration
```

---

## 🛠 Installation & Setup

### **Prerequisites**
*   Node.js (v18 or higher)
*   MongoDB Atlas Account (or local MongoDB)
*   Cloudinary Account (for media)

### **1. Clone the Repository**
```bash
git clone https://github.com/shoaibr26/fixonic.git
cd fixonic
```

### **2. Frontend Setup**
```bash
npm install
npm run dev
```
ACCESS: `http://localhost:5173`

### **3. Backend Setup**
```bash
cd server
npm install
# Create .env file before running
npm run dev
```
ACCESS: `http://localhost:5000`

---

## 🔑 Environment Variables

### Frontend (project root)

Create a `.env` file in the project root (see `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:5000/api
# Optional: for Stripe card form on checkout
# VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### Backend (server/)

Create a `.env` file in the `server/` directory and add the following keys:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/fixonic

# Security
JWT_SECRET=your_super_secret_key_change_this
FRONTEND_URL=http://localhost:5173

# Email Service (Gmail SMTP Example)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📡 API Documentation

### **Authentication**
*   `POST /api/auth/register` - Create new user account
*   `POST /api/auth/login` - Authenticate user & get token
*   `POST /api/auth/forgot-password` - Request password reset

### **Repairs**
*   `GET /api/repairs` - Get all repairs (Admin) or My Repairs (User)
*   `POST /api/repairs` - Submit a new repair request
*   `PUT /api/repairs/:id` - Update status (Vendor/Admin)
*   `DELETE /api/repairs/:id` - Cancel request

### **Accessories (Store)**
*   `GET /api/accessories` - List all products
*   `POST /api/accessories` - Add new product (Admin)
*   `POST /api/orders` - Place a new order

### **Uploads**
*   `POST /api/upload` - Upload image/video to Cloudinary (Returns URL)

---

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

**Developed by Shoaib Ramzan** | Final Year Project 2026

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
