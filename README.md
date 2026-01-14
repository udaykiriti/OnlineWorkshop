<h1 align="center">Online Workshop Frontend</h1>

<div align="center">

[![Build Status](https://github.com/udaykiriti/OnlineWorkshop/actions/workflows/ci.yml/badge.svg)](https://github.com/udaykiriti/OnlineWorkshop/actions)
[![Docker Build](https://github.com/udaykiriti/OnlineWorkshop/actions/workflows/docker-build.yml/badge.svg)](https://github.com/udaykiriti/OnlineWorkshop/actions)
[![React](https://img.shields.io/badge/react-%5E18.2.0-61dafb.svg?style=flat&logo=react)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-339933.svg?style=flat&logo=node.js)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg?style=flat&logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

<p align="center">
  <img src="https://media.giphy.com/media/3o7aD4pQZ7xUWL3G7i/giphy.gif" width="45%" alt="React Animation" />
  <img src="https://media.giphy.com/media/UxTZDNv0Zej4s/giphy.gif" width="45%" alt="Coding Animation" />
</p>

<p align="center">
  <b>A modern, responsive frontend for the Online Workshop management system.</b>
</p>

---

## About

This repository hosts the frontend client for the **Online Workshop** application. It is built with **React** to provide a dynamic, seamless, and visually engaging user experience for students, faculty, and administrators.

The application recently underwent a major UI overhaul, featuring a **Glassmorphism** design language, smooth animations, and a fully responsive layout.

---

## Key Features

### Modern UI/UX
*   **Glassmorphism Design:** Sleek, semi-transparent cards with soft shadows and blur effects.
*   **Interactive Elements:** Smooth hover animations on buttons, inputs, and images.
*   **Responsive Layout:** Seamless experience across Desktop, Tablet, and Mobile devices.

### Robust Authentication
*   Secure **Login** and **Signup** with CAPTCHA protection.
*   **Forgot Password** & **Reset Password** workflows.
*   Role-based redirection (Student, Faculty, Admin).

### Dashboard & Management
*   **Admin:** Manage workshops, users, and system settings.
*   **Faculty:** Create workshops and view attendance.
*   **Student:** Browse, register, and attend workshops.

---

## Technologies Used

*   **React:** Component-based UI library.
*   **CSS3:** Custom styling with CSS Variables, Flexbox, and Grid.
*   **Axios:** Efficient HTTP client for API communication.
*   **React Router:** Dynamic client-side routing.
*   **React Toastify:** Beautiful notifications.
*   **Docker:** Containerization for consistent deployment.
*   **GitHub Actions:** Automated CI/CD pipelines.

---

## Project Structure

```bash
src/
├── admincomponents/    # Admin-specific dashboards and tools
├── components/         # Shared auth pages (Login, Signup, Reset Password)
├── facultycomponents/  # Faculty-specific dashboards
├── public/             # Static assets (images, icons)
├── App.js              # Main application router
└── index.css           # Global styles
```

---

## Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/udaykiriti/onlineworkshop-frontend.git
    cd onlineworkshop-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```
    The app will open at `http://localhost:3000`.

---

## Docker Support

You can also run the application using Docker:

1.  **Build and run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```

The application will be available at `http://localhost:3000`.

---

## Contributing

Contributions are welcome! Please fork the repository and create a pull request for any feature enhancements or bug fixes.

---

<p align="center">
  Made with React
</p>
