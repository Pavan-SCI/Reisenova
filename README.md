<div align="center">
  <img src="./frontend/public/favicon.svg" alt="Reisenova Logo" width="120" />
  
  # Reisenova Travel & Tours 🌴

  **Your Ultimate Travel Partner in Sri Lanka**

  *A premium, full-stack web application designed for a luxury travel agency. Features high-performance 3D scroll animations, a responsive modern UI, and a robust backend integrated with Google Workspace and Firebase.*

  [![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02?style=for-the-badge&logo=greensock)](https://greensock.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
  [![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
</div>

<br />

## 🌟 Overview

**Reisenova Travel & Tours** is a sophisticated, full-stack travel booking platform built to provide users with an immersive experience of Sri Lanka's wildlife, beauty, and culture. 

The project was engineered with a heavy focus on **Frontend Performance and UI/UX Excellence**, utilizing GSAP and Lenis for buttery-smooth parallax scrolling, 3D text reveals, and dynamic background rendering. The backend securely handles user authentication, automated email confirmations, and direct CRM integration via Google Sheets API.

This project serves as a comprehensive showcase of modern web development practices, highlighting skills in UI engineering, state management, API integration, and performance optimization.

## ✨ Key Features

### 🎨 Advanced Frontend Experience
- **Immersive 3D Animations:** Custom scroll-triggered animations and mouse parallax effects built from scratch using `GSAP` and `ScrollTrigger`.
- **Smooth Scrolling:** Integrated `@studio-freight/lenis` for native-feeling, momentum-based smooth scrolling across the entire application.
- **Dynamic Backgrounds:** A highly optimized, responsive `JungleBackground` component that dynamically scales, blurs, and shifts based on user scroll position.
- **Premium UI Design:** Built with `Tailwind CSS`, featuring dark mode support, glassmorphism, custom typography, and carefully crafted micro-interactions.
- **Fully Responsive:** Meticulously designed to look and function perfectly across all device sizes, from ultra-wide desktops to small mobile screens.

### ⚙️ Robust Backend & Integrations
- **Secure Authentication:** User login and registration powered by `Firebase Authentication` (Email/Password & Google OAuth).
- **Google Sheets CRM Integration:** Seamlessly records all trip inquiries, vehicle rentals, and hotel bookings directly into a Google Sheet using the `Google APIs` client.
- **Automated Email Notifications:** Uses `Nodemailer` to send immediate, beautifully formatted HTML confirmation emails to users upon booking.
- **RESTful API:** An `Express.js` backend with modular routing, error handling, and secure environment variable management.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS
- GSAP (GreenSock Animation Platform)
- Lenis (Smooth Scroll)
- Lucide React (Icons)
- React Router DOM

**Backend:**
- Node.js & Express.js
- Firebase Admin SDK
- Googleapis (Google Sheets API)
- Nodemailer
- dotenv & CORS

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Firebase Project (for Authentication)
- A Google Cloud Project with Google Sheets API enabled (Service Account credentials)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pavan-SCI/Reisenova.git
   cd Reisenova
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory with your Google Service Account credentials and Email credentials.
   - Place your `firebase-service-account.json` in the `backend` directory.
   - Run the server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   - Create a `.env` file in the `frontend` directory with your Firebase Client configuration (`VITE_FIREBASE_API_KEY`, etc.).
   - Run the development server:
   ```bash
   npm run dev
   ```

## 🧠 Technical Decisions & Optimizations

- **Animation Performance:** To prevent scroll lag on mobile devices, expensive CSS filters (like `mix-blend-mode` and complex `backdrop-blur`) were stripped from deeply nested GSAP animated elements, resulting in a consistent 60fps scroll experience.
- **Component Reusability:** The UI is broken down into highly reusable components (e.g., `DynamicLeaf`, `GlassPalmTreeBadge`) to maintain clean code and easy scalability.
- **State Management:** Handled locally within components using React Hooks (`useState`, `useEffect`, `useLayoutEffect`), ensuring optimal rendering cycles without the overhead of complex global state libraries.

## 👤 Author

**Pavan Wishvajayasekara**
- GitHub: [@Pavan-SCI](https://github.com/Pavan-SCI)

*This project was built to demonstrate proficiency in modern full-stack web development, advanced frontend animations, and third-party API integrations.*
