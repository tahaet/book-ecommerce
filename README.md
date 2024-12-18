# Book E-Commerce REST API

This is a **RESTful API** for a Book E-Commerce platform, developed using **Node.js 22**, **Express**, **MongoDB**, and **Mongoose**. The API includes advanced features such as **filtering**, **sorting**, and **pagination** for book data, secure authentication, and seamless payment integration using **Stripe**.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Books](#books)
  - [Payments](#payments)
- [Security Measures](#security-measures)
- [Environment Variables](#environment-variables)
- [License](#license)

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

---

## Technologies Used

- **Node.js** (v22)
- **Express** (Framework)
- **MongoDB** with **Mongoose** (Data Storage)
- **Stripe** (Payment Gateway)
- **JWT** (Authentication)
- **Multer** (File Uploads)
- **Bcrypt** (Password Encryption)
- **Helmet**, **XSS-Clean**, and **Rate Limiting** (Security)
- **Morgan** (Logging)
- **Nodemailer** (Email Services)

---

## Project Structure

```plaintext
book-ecommerce/
│
├── src/
│   ├── config/            # Configuration files (e.g., DB connection, Stripe setup)
│   ├── controllers/       # Route controllers for handling requests
│   ├── models/            # Mongoose models (Book, User, etc.)
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware (auth, error handling, etc.)
│   ├── utils/             # Utility functions (email, pagination, etc.)
│   ├── public/            # Public assets
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

---

## API Documentation

### Authentication

1. **Register a User**
   - `POST /api/v1/auth/register`
   - Request Body:
     ```json
     {
       "name": "John Doe",
       "email": "john@example.com",
       "password": "password123",
       "role": "user"
     }
     ```

2. **Login**
   - `POST /api/v1/auth/login`
   - Request Body:
     ```json
     {
       "email": "john@example.com",
       "password": "password123"
     }
     ```

---

### Books

1. **Get All Books** (With Filtering, Sorting, and Pagination)
   - `GET /api/v1/books`
   - Query Parameters:
     - Filtering: `?price[gte]=10&category=fiction`
     - Sorting: `?sort=price,-title`
     - Pagination: `?page=2&limit=10`
   - Example Response:
     ```json
     {
       "status": "success",
       "results": 10,
       "data": {
         "books": [ /* Array of books */ ]
       }
     }
     ```

2. **Create a Book** (Admin only)
   - `POST /api/v1/books`
   - Request Body:
     ```json
     {
       "title": "Book Title",
       "author": "Author Name",
       "price": 19.99,
       "category": "fiction"
     }
     ```

---

### Payments

1. **Checkout with Stripe**
   - `POST /api/v1/payments/checkout`
   - Request Body:
     ```json
     {
       "amount": 1999,
       "currency": "usd",
       "description": "Purchase of Book Title",
       "source": "tok_mastercard"
     }
     ```

---

## Security Measures

- **Helmet**: Secures HTTP headers.
- **XSS-Clean**: Sanitizes user input against XSS attacks.
- **Express-Rate-Limit**: Limits repeated requests to prevent brute-force attacks.
- **HPP**: Prevents HTTP parameter pollution.
- **JWT Authentication**: Ensures secure access to protected routes.

---

## Environment Variables

Set the following variables in your `.env` file:

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

---


