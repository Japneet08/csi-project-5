# Social Media App

A simple social media application built with Node.js, Express.js, and MongoDB that allows users to register, login, create posts, like posts, and manage their profiles.

## Features

- **User Authentication**: Register and login with email and password
- **User Profiles**: View and manage user profiles
- **Post Creation**: Create and share posts
- **Post Management**: Edit and delete your own posts
- **Social Interactions**: Like and unlike posts
- **Session Management**: Secure cookie-based authentication

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Template Engine**: EJS
- **Styling**: CSS (static files)

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-media-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/social-media-app
   JWT_SECRET=your-secret-key-here
   PORT=3000
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.3",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "cookie-parser": "^1.4.6",
    "ejs": "^3.1.9",
    "dotenv": "^16.0.3"
  }
}
```

To install all dependencies:
```bash
npm install express mongoose bcrypt jsonwebtoken cookie-parser ejs dotenv
```

## API Endpoints

### Authentication Routes
```
GET    /           - Home page
GET    /login      - Login page  
POST   /register   - Register new user
POST   /login      - User login
GET    /logout     - User logout
```

### Protected Routes (require authentication)
```
GET    /profile    - View user profile with posts
POST   /abc        - Create new post
GET    /like/:id   - Like/unlike a post
GET    /edit/:id   - Edit post page
POST   /edit/:id   - Update post
GET    /delete/:id - Delete post
```

## Database Models

### User Model
```javascript
{
  name: String,        // Required
  username: String,    // Required  
  email: String,       // Required, unique
  password: String,    // Required, hashed
  age: Number,
  posts: [ObjectId]    // Array of post references
}
```

### Post Model
```javascript
{
  user: ObjectId,      // Reference to User model
  content: String,     // Post content
  likes: [ObjectId],   // Array of user IDs who liked
  createdAt: Date      // Automatic timestamp
}
```

## Project Structure

```
social-media-app/
├── models/
│   ├── user.model.js
│   └── post.model.js
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   └── edit.ejs
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── .env
├── package.json
└── app.js
```

## Security Features

- **Password Hashing**: User passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Middleware to protect authenticated routes
- **Input Validation**: Basic server-side validation

## Usage

1. **Registration**: Navigate to the home page and register with your details
2. **Login**: Use your email and password to login
3. **Create Posts**: Once logged in, create posts from your profile
4. **Interact**: Like posts and view other users' content
5. **Manage**: Edit or delete your own posts

## Development

To run in development mode with auto-restart:

```bash
npm install -g nodemon
nodemon app.js
```





