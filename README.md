# Quiz-Api 🚀

A robust, RESTful API for managing quizzes, user authentication, and automated grading. Built with Node.js, Express, and MongoDB.

## 🌟 Features
* **User Authentication**: Secure registration and login using JWT.
* **Quiz Management**: Create and fetch quizzes with dynamic question linking.
* **Automated Grading Engine**: Real-time scoring and letter grade ($A-F$) assignment.
* **Production Ready**: Optimized for Linux-based environments (Render) with strict pathing logic.

## 🛠️ Technical Stack
* **Backend**: Node.js, Express
* **Database**: MongoDB Atlas (Mongoose ODM)
* **Security**: Bcrypt.js, Dotenv, JWT
* **Deployment**: Render

## 🚀 Getting Started

[LIVE LINK](https://quiz-api-4-z58u.onrender.com)

### 1. Prerequisites
* Node.js (v18+)
* MongoDB Atlas Account

### 2. Installation

bash
> git clone

`https://github.com/godswill66/Quiz-Api.git`

> cd Quiz-Api

`npm install`

`MONGO_URI=your_mongodb_connection_string`

`JWT_SECRET=your_secret_key`

`PORT=3000`

>Production/Manual Launch:

`node src/server.js`


>Method,Endpoint,Description

`POST,/api/auth/register,Register a new user`

`POST,/api/auth/login,Login and receive JWT`

`GET,/api/quizzes,Fetch all available quizzes`

`POST,/api/results/:quizId/submit,Submit answers and get grade`
