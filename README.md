# Auth-Docker

A Node.js authentication service with JWT-based password reset functionality, Dockerized for easy deployment.

## 🛠️ Features

- User registration and login
- JWT-based authentication
- Password reset via email
- Docker support for containerized deployment

---

## 📦 Project Structure

```
├── Dockerfile
├── docker-compose.yml
├── .env
├── package.json
├── app.js
└── routes/
    ├── auth.js
    └── user.js
```

---

## 🚀 Setup and Run

### Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/)
- Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/auth-docker.git
cd auth-docker
```

### 2. Set up the environment variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000

# Database Configuration
MONGO_URI=mongodb+srv://your_user:your_pass@cluster.mongodb.net/auth

# JWT Secrets
JWT_SECRET="your_jwt_secret"
REFRESH_SECRET="your_refresh_secret"

# Email Configuration
EMAIL=your_email@gmail.com
PASS=your_email_password
```

### 3. Build and Run the Docker Containers

```bash
docker-compose up --build
```

The service will be available at `http://localhost:3000`

---

## 📋 API Endpoints

### 1. User Registration

```bash
curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com", "password":"password123"}'
```

### 2. User Login

```bash
curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com", "password":"password123"}'
```

### 3. Password Reset Request

```bash
curl -X POST http://localhost:3000/auth/reset-password-request \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com"}'
```

### 4. Reset Password

```bash
curl -X POST http://localhost:3000/auth/reset-password \
     -H "Content-Type: application/json" \
     -d '{"token":"your_reset_token", "newPass":"newpassword123"}'
```

---

## 🧪 Testing the Service

You can verify the Docker containers are running with:

```bash
docker ps
```

Check logs:

```bash
docker-compose logs -f
```

---

## 📖 Notes

- Ensure the `.env` file is updated with valid MongoDB and email credentials.
- Adjust `PORT` if needed.

## 📜 License

This project is licensed under the MIT License.

