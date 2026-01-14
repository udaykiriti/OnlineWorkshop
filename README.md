<h1 align="center"> Online Workshop Frontend</h1>

<p align="center">
  <img src="https://media.giphy.com/media/3o7aD4pQZ7xUWL3G7i/giphy.gif" width="250" alt="React Animation" />
</p>

<p align="center">
  <b>A modern, responsive frontend for the Online Workshop management system.</b>
</p>

---

##  About

This repository hosts the frontend client for the **Online Workshop** application. It is built with **React** to provide a dynamic, seamless, and visually engaging user experience for students, faculty, and administrators.

The application recently underwent a major UI overhaul, featuring a **Glassmorphism** design language, smooth animations, and a fully responsive layout.

---

##  Key Features

- ** Modern UI/UX:**
  - **Glassmorphism Design:** Sleek, semi-transparent cards with soft shadows and blur effects.
  - **Interactive Elements:** Smooth hover animations on buttons, inputs, and images.
  - **Responsive Layout:** seamless experience across Desktop, Tablet, and Mobile devices.

- ** Robust Authentication:**
  - Secure **Login** and **Signup** with CAPTCHA protection.
  - **Forgot Password** & **Reset Password** workflows.
  - Role-based redirection (Student, Faculty, Admin).

- ** Dashboard & Management:**
  - **Admin:** Manage workshops, users, and system settings.
  - **Faculty:** Create workshops and view attendance.
  - **Student:** Browse, register, and attend workshops.

---

##  Technologies Used

- **React:** Component-based UI library.
- **CSS3:** Custom styling with CSS Variables, Flexbox, and Grid.
- **Axios:** efficient HTTP client for API communication.
- **React Router:** Dynamic client-side routing.
- **React Toastify:** Beautiful notifications.

---

##  Project Structure

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

##  Getting Started

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

<p align="center">
  Made with using React
</p>