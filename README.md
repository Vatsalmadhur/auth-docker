# Auth-Docker

A Node.js-based authentication system with Docker containerization, featuring user registration, login, password reset, and JWT authentication with rate limiting.

## Features
- User Registration and Login
- Password Reset Functionality
- JWT Authentication
- Dockerized Environment
- Rate Limiting for API Protection

## Prerequisites
- Docker and Docker Compose installed

## Project Structure
```
.
├── Dockerfile
├── docker-compose.yml
├── package.json
├── app.js
├── routes
│   ├── auth.js
└── .env
```

## Environment Variables
Create a `.env` file in the root directory with the following:

```
PORT=3000
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
EMAIL=your_email@gmail.com
PASS=your_email_password
```

## Docker Setup

1. **Build Docker Image:**

```bash
docker-compose build
```

2. **Run Docker Container:**

```bash
docker-compose up
```

The API will be available at `http://localhost:3000/auth`

## API Endpoints

### 1. Register a User
```bash
curl -X POST "http://localhost:3000/auth/register" \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com", "password":"yourpassword"}'
```

### 2. Login
```bash
curl -X POST "http://localhost:3000/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com", "password":"yourpassword"}'
```

### 3. Refresh Token
```bash
curl -X POST "http://localhost:3000/auth/refresh" \
     -H "Content-Type: application/json" \
     -d '{"token":"your_refresh_token"}'
```

### 4. Logout
```bash
curl -X POST "http://localhost:3000/auth/logout" \
     -H "Content-Type: application/json" \
     -d '{"token":"your_refresh_token"}'
```

### 5. Request Password Reset
```bash
curl -X POST "http://localhost:3000/auth/reset-password-request" \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com"}'
```

### 6. Reset Password
```bash
curl -X POST "http://localhost:3000/auth/reset-password" \
     -H "Content-Type: application/json" \
     -d '{"token":"reset_token", "newPass":"newpassword"}'
```

### 7. Profile
```bash
curl -X GET "http://localhost:3000/auth/profile" \
     -H "Authorization: Bearer your_access_token"
```

## Rate Limiting

The system implements rate limiting to restrict the number of requests per user:
- Limit: 100 requests per 15 minutes.

### Shell Script to Test Rate Limiting

Create a file `test_rate_limit.sh` with the following content:

```bash
#!/bin/bash

for i in {1..110}
do
  echo "Request #$i"
  curl -X GET "http://localhost:3000/auth/profile" \
       -H "Authorization: Bearer your_access_token"
  echo "\n"
  sleep 1
done
```

Run the script:

```bash
bash test_rate_limit.sh
```

You should start receiving `429 Too Many Requests` after the 100th request.

## Stop Docker Containers

```bash
docker-compose down
```

## License
MIT License

