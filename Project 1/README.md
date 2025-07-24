# Cafe Reservation System

A full-stack web application for managing cafe table reservations with user authentication and admin panel functionality. Built as part of an internship project at Skillify Zone.

## 🚀 Features

### For Users
- **Authentication System**: Secure user registration and login with proper validation
- **Table Reservation**: Reserve tables
- **Booking Management**: Edit and delete your reservations
- **Review System**: Leave reviews and feedback for the cafe

### For Admins
- **Booking Overview**: View and manage all customer reservations
- **Reservation Control**: Edit and delete any booking
- **Review Moderation**: Remove inappropriate reviews

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Template Engine**: EJS
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **Middleware**: Cookie Parser
- **Frontend**: JavaScript, HTML, CSS

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or MongoDB Atlas account)
- npm or yarn package manager


## 📁 Project Structure

```
cafe-reservation-system/
├── models/          # MongoDB schemas
├── views/           # EJS templates
├── public/          # Static files (CSS, JS, images)
├── .env             # Environment variables
├── app.js        # Main application file
└── package.json     # Dependencies and scripts
```

## 🔐 Authentication

The application uses JWT-based authentication with the following security features:
- Password hashing using bcrypt
- JWT tokens stored in HTTP-only cookies
- Protected routes for authenticated users
- Role-based access control for admin features

## 🧪 Testing

To test the application:
1. Register a new user account
2. Login with your credentials
3. Make a table reservation
4. Edit or delete your reservation
5. Leave a review
6. Test admin functionality (if you have admin access)


## 📝 License

This project is created as part of an internship program at Skillify Zone.

## 👨‍💻 Author

**[Ammar]**
- Intern at Skillify Zone
- GitHub: [@iammar99]
- LinkedIn: [[Your LinkedIn Profile](https://www.linkedin.com/in/ch-ammar-a1115527b/)]


## 🐛 Known Issues

- [List any known bugs or limitations]
- [Future improvements planned]



*This project was developed as part of an internship program at Skillify Zone.*