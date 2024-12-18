# Book E-Commerce REST API

This is a **RESTful API** for a Book E-Commerce platform, developed using **Node.js 22**, **Express**, **MongoDB**, and **Mongoose**. The API includes advanced features such as **filtering**, **sorting**, and **pagination** for book data, secure authentication, and seamless payment integration using **Stripe**.

---

## Table of Contents

- [Features](#features)
- [Security Measures](#security-measures)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)

---

## Features

1. **Advanced Filtering, Sorting, and Pagination**:
   - Filter books based on fields such as `title`, `price`, `author`, or `category`.
   - Sort results by ascending/descending order.
   - Pagination to handle large datasets effectively.

2. **Secure API Access**:
   - JWT-based authentication for secure access.
   - Role-based authorization to manage user permissions.

3. **Stripe Payment Integration**:
   - Seamless payment processing using Stripe.
   - Handles successful and failed transactions securely.

4. **File Uploads**:
   - Upload book images using **Multer**.

5. **Data Validation**:
   - Validates user input using libraries like **Validator**.

6. **Error Handling**:
   - Centralized error handling for cleaner and consistent responses.

7. **Security Measures**:
   - Protection against common vulnerabilities such as XSS, HPP, and brute-force attacks using middleware like **Helmet**, **XSS-Clean**, and **Express-Rate-Limit**.

8. **Unit and Integration Testing**:
   - Comprehensive test coverage for routes, controllers, and middleware.

---

## Security Measures

- **Helmet**: Secures HTTP headers.
- **XSS-Clean**: Sanitizes user input against XSS attacks.
- **Express-Rate-Limit**: Limits repeated requests to prevent brute-force attacks.
- **HPP**: Prevents HTTP parameter pollution.
- **JWT Authentication**: Ensures secure access to protected routes.
## Technologies Used

---

- **Node.js** (v22)
- **Express** 
- **MongoDB** with **Mongoose** (Data Storage)
- **Stripe** (Payment Gateway)
- **JWT** (Authentication)
- **Multer** (File Uploads)
- **Bcrypt** (Password Encryption)
- **Helmet**, **XSS-Clean**, and **Rate Limiting** (Security)
- **Morgan** (Logging)
- **Nodemailer** (Email Services)
- **Jest** and **Supertest** (Testing Frameworks)

---

## Project Structure

```plaintext
book-ecommerce/
├── public/                 # Public assets
├── src/
│   ├── config/            # Configuration files (e.g., DB connection, Stripe setup)
│   ├── controllers/       # Route controllers for handling requests
│   ├── models/            # Mongoose models (Book, User, etc.)
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware (auth, error handling, etc.)
│   ├── utils/             # Utility functions (email, pagination, etc.)
│   ├── tests/             # Unit and integration tests
│   └── server.js          # Entry point of the application
│
├── .env                   # Environment variables
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

---

## Setup and Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/book-ecommerce.git
   cd book-ecommerce
   ```

2. **Install Dependencies**
   Ensure you have **Node.js** and **MongoDB** installed.
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the project root and set up the following variables:

   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   STRIPE_SECRET_KEY=your_stripe_secret_key
   EMAIL_HOST=your_email_host
   EMAIL_PORT=your_email_port
   EMAIL_USERNAME=your_email_username
   EMAIL_PASSWORD=your_email_password
   ```

4. **Run the Server**
   Start the server in development mode:
   ```bash
   npm start
   ```
   The server will run at `http://localhost:3000`.

5. **Run Tests**
   To run the unit and integration tests:
   ```bash
   npm test
   ```

---



---




