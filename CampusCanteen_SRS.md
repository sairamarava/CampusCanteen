# Software Requirements Specification (SRS)
## Project Title: CampusCanteen
**Version:** 1.0  
**Date:** October 2025  
**Prepared By:** Ram  

---

## 1. Introduction

### 1.1 Purpose
The purpose of the *CampusCanteen* system is to develop a next-generation AI-based food ordering web application exclusively for college campuses. It will function as a localized version of Zomato/Swiggy, enabling students and faculty to browse the canteen menu, place food orders, make digital payments, and track order status in real-time.

This document defines the system’s functional and non-functional requirements, architecture, design flow, and user interaction to ensure a smooth and scalable implementation using the **MERN Stack** and **Tailwind CSS**.

---

### 1.2 Scope
The system will:
- Provide a **modern, sleek, and minimal interface** for ordering canteen food online.  
- Allow **AI-powered menu recommendations** based on user behavior and popular items.  
- Implement **core modules** like login/signup, menu browsing, cart management, order tracking, and user feedback.  
- Include **frontend animations and transitions** for a smooth, interactive experience.  
- Target the **college ecosystem**, supporting students, staff, and canteen administrators.

Future scope includes:
- AI chatbot for food recommendations.
- Integration with payment gateways.
- Admin dashboard for canteen management.

---

### 1.3 Intended Audience
- **Students/Faculty:** To place food orders quickly.  
- **Canteen Admins:** To manage menus, track orders, and view analytics.  
- **Developers/Designers:** To maintain and extend the system.  
- **Project Evaluators:** For academic review and grading.  

---

### 1.4 System Overview
CampusCanteen will be a **single-page application (SPA)** built using ReactJS (frontend), Node.js and Express (backend), and MongoDB (database). Tailwind CSS will be used for responsive, elegant UI design with scroll-based animations.

---

## 2. Overall Description

### 2.1 Product Perspective
CampusCanteen acts as an intermediary between canteen services and college users.  
It mirrors professional food ordering platforms with college-specific optimizations.

**System Architecture:**  
- **Frontend:** ReactJS + Tailwind CSS  
- **Backend:** Node.js + Express  
- **Database:** MongoDB  
- **AI Engine:** Recommendation system (future enhancement)  

---

### 2.2 Product Features
| Feature | Description |
|----------|--------------|
| **User Authentication** | Secure login/signup using JWT or OAuth |
| **Menu Display** | Dynamic food items with category filters |
| **Search & Filter** | Search bar, category filter, and price filter |
| **Cart Management** | Add/remove items, view total price |
| **Checkout** | Payment simulation and order confirmation |
| **Order Tracking** | Track order status (Preparing, Ready, Delivered) |
| **AI Recommendations** | Suggest dishes based on order history |
| **Admin Dashboard** | Manage menu, view orders, analyze sales |
| **Responsive Design** | Fully optimized for desktop, tablet, and mobile |
| **Scroll Animations** | Smooth section transitions using Framer Motion or AOS |
| **Dark/Light Mode** | Toggle UI themes dynamically |
| **About Section & Footer** | Details about canteen, contact info, and links |

---

### 2.3 User Classes and Characteristics
| User Type | Role | Access |
|------------|------|--------|
| **Student/Faculty** | End-user who orders food | View menu, order food, track delivery |
| **Canteen Staff/Admin** | Manage backend | Add/edit/delete items, update order status |
| **System Administrator** | Maintenance | Manage users, system logs, and backups |

---

### 2.4 Operating Environment
- **Frontend:** React v18+, Tailwind CSS v3.17+  
- **Backend:** Node.js v20+, ExpressJS  
- **Database:** MongoDB Atlas  
- **Hosting:** Vercel (Frontend), Render/Heroku (Backend)  
- **Browser Support:** Chrome, Edge, Firefox, Safari  

---

## 3. Functional Requirements

| ID | Module | Requirement Description |
|----|---------|--------------------------|
| FR1 | Authentication | The system shall allow users to register, login, and logout securely. |
| FR2 | Menu | The system shall display food categories and items fetched from MongoDB. |
| FR3 | Cart | The system shall allow users to add/remove food items to the cart. |
| FR4 | Checkout | The system shall allow users to simulate order confirmation and payment. |
| FR5 | Order Tracking | The system shall display order status updated by admin. |
| FR6 | Recommendation | The system shall show AI-based food recommendations. |
| FR7 | Admin Panel | The admin shall be able to modify menus and update orders. |
| FR8 | Animations | Each section shall have smooth scroll and hover animations. |
| FR9 | Responsiveness | The UI shall adapt dynamically to all screen sizes. |

---

## 4. Non-Functional Requirements

| Type | Description |
|------|--------------|
| **Performance** | App must load in under 2 seconds and handle up to 100 concurrent users. |
| **Scalability** | Should be easily expandable for multiple canteens. |
| **Usability** | UI/UX must follow minimal design principles and accessibility guidelines. |
| **Security** | All sensitive data (passwords, tokens) must be encrypted. |
| **Maintainability** | Modular code structure for React components and Express routes. |
| **Availability** | Minimum 99% uptime on hosted platforms. |
| **Design Aesthetics** | Premium $300 UI experience using Tailwind, Framer Motion, and Glassmorphism. |

---

## 5. System Design Overview

### 5.1 Frontend Structure (React + Tailwind CSS)
```
/src
 ├── components/
 │   ├── Navbar.jsx
 │   ├── HeroSection.jsx
 │   ├── About.jsx
 │   ├── Menu.jsx
 │   ├── FoodCard.jsx
 │   ├── Cart.jsx
 │   ├── OrderTracker.jsx
 │   ├── Testimonials.jsx
 │   ├── Footer.jsx
 │   └── ScrollToTopButton.jsx
 ├── pages/
 │   ├── Home.jsx
 │   ├── Login.jsx
 │   ├── Register.jsx
 │   ├── AdminDashboard.jsx
 │   └── Checkout.jsx
 ├── App.jsx
 ├── index.js
 └── styles/
     └── globals.css
```

### 5.2 Backend Structure (Planned)
```
/server
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── config/
 └── server.js
```

---

## 6. UI/UX Design Principles
- **Modern UI Trends:** Glassmorphism + Neumorphism blend  
- **Color Palette:** Warm canteen colors (Brown, Beige, Maroon accents)  
- **Typography:** Inter / Poppins (readable, friendly)  
- **Animations:** Framer Motion for smooth transitions and hover interactions  
- **Responsive Layout:** Tailwind’s grid & flex utilities for all breakpoints  
- **Microinteractions:** Animated buttons, loading indicators, and hover cards  

---

## 7. Future Enhancements
- AI Chatbot for personalized food suggestions  
- Integration with UPI/Paytm/Razorpay  
- QR-based table ordering  
- Analytics dashboard for canteen owners  
- Offline PWA support  

---

## 8. Constraints
- Limited to internal college canteen delivery  
- Network-dependent performance  
- Budget constraint: $300 for design and frontend scope  

---

## 9. Conclusion
CampusCanteen aims to deliver a futuristic food-ordering experience within a campus ecosystem — combining the intuitiveness of **Zomato/Swiggy** with the exclusivity and AI-powered personalization of a next-gen web platform. The design will emphasize accessibility, speed, and delight.
