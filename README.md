# Library Management System

A comprehensive RESTful API for managing library operations including books, borrowers, borrows, and analytics. Built with Node.js, Express, and MySQL using Sequelize ORM.

## 📋 Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Usage Examples](#usage-examples)
- [Security Features](#security-features)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- **Book Management**: Create, read, update, delete, and search books
- **Borrower Management**: Register, login, update, and manage borrowers
- **Borrow Operations**: Checkout and return books with automatic inventory management
- **Analytics & Reports**: Export borrow data and analytics in CSV and Excel formats
- **Pagination**: Efficient data retrieval with pagination support
- **Search**: Search books by title, author, or ISBN

### Security & Performance
- **JWT Authentication**: Secure token-based authentication for admins and borrowers
- **Rate Limiting**: Redis-based rate limiting to prevent abuse
- **Input Validation**: Comprehensive request validation using express-validator
- **Input Sanitization**: Protection against XSS attacks
- **Optimistic Locking**: Prevents concurrent modification issues

## 🛠 Technologies

- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MySQL
- **ORM**: Sequelize 6.37.7
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Rate Limiting**: express-rate-limit with Redis
- **File Export**: ExcelJS, json2csv
- **Testing**: Jest, Supertest

## 📦 Prerequisites

### For Local Development
- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)
- **Redis** (for rate limiting)
- **npm** or **yarn**

### For Docker (Recommended)
- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ibrahemElshal/library-management-system.git
   cd library-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DB_NAME=library_db
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=your_jwt_secret_key
   PORT=5001
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. **Create MySQL database**
   ```sql
   CREATE DATABASE library_db;
   ```

5. **Start Redis server**
   ```bash
   redis-server
   ```

6. **Start the application**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:5001` (or the port specified in your `.env` file).

## 🐳 Docker Installation (Recommended)

The easiest way to run the application is using Docker Compose, which sets up the application, MySQL, and Redis automatically.

### Prerequisites for Docker
- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/ibrahemElshal/library-management-system.git
   cd library-management-system
   ```

2. **Build and start all services**
   ```bash
   docker-compose up -d
   ```

   This will:
   - Build the Node.js application image
   - Start MySQL database container
   - Start Redis container
   - Start the application container
   - Automatically create the database and run migrations

3. **View logs**
   ```bash
   docker-compose logs -f app
   ```

4. **Stop all services**
   ```bash
   docker-compose down
   ```

5. **Stop and remove volumes (clean slate)**
   ```bash
   docker-compose down -v
   ```

### Docker Commands

- **Start services**: `docker-compose up -d`
- **Stop services**: `docker-compose stop`
- **View logs**: `docker-compose logs -f`
- **Restart a service**: `docker-compose restart app`
- **Rebuild after code changes**: `docker-compose up -d --build`
- **Access MySQL**: `docker-compose exec mysql mysql -u library_user -p library_db`
- **Access Redis CLI**: `docker-compose exec redis redis-cli`

### Environment Variables for Docker

The `docker-compose.yml` file includes default environment variables. To customize them, you can:

1. **Edit docker-compose.yml** directly, or
2. **Create a `.env` file** in the project root (Docker Compose will automatically use it)

Example `.env` file:
```env
DB_NAME=library_db
DB_USER=library_user
DB_PASSWORD=library_password
DB_HOST=mysql
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5001
REDIS_HOST=redis
REDIS_PORT=6379
```

### Docker Services

- **app**: Node.js application (port 5001)
- **mysql**: MySQL 8.0 database (port 3306)
- **redis**: Redis cache (port 6379)

All services are connected via a Docker network and can communicate using service names as hostnames.

## ⚙️ Configuration

### Database Configuration
The database connection is configured in `config/database.js`. Update the connection parameters in your `.env` file.

**Important**: When using Docker, set `DB_HOST=mysql` (the service name). For local development, use `DB_HOST=localhost`.

### Redis Configuration
Redis is used for rate limiting. Configure it in `config/redis.js` or via environment variables.

### JWT Secret
Generate a strong secret key for JWT token signing. You can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📚 API Documentation

For complete API documentation with detailed request/response examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Quick Reference

**Base URL:**
```
http://localhost:5001/api
```

**Authentication:**
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### API Endpoints Summary

#### Admin Endpoints
- `POST /api/admin/add` - Create a new admin
- `POST /api/admin/login` - Admin login (returns JWT token)

#### Book Endpoints
- `POST /api/books` - Create a book (Admin auth required)
- `GET /api/books` - Get all books (with pagination)
- `GET /api/books/search?query=<term>` - Search books
- `PUT /api/books/:id` - Update a book (Admin auth required)
- `DELETE /api/books/:id` - Delete a book (Admin auth required)

#### Borrower Endpoints
- `POST /api/borrowers/register` - Register a new borrower
- `POST /api/borrowers/login` - Borrower login (returns JWT token)
- `GET /api/borrowers` - Get all borrowers (Admin auth required, with pagination)
- `PUT /api/borrowers/:id` - Update borrower information
- `DELETE /api/borrowers/:id` - Delete a borrower (Admin auth required)

#### Borrow Endpoints
- `POST /api/borrows/checkout` - Checkout a book
- `PUT /api/borrows/return/:id` - Return a book (Borrower auth required)
- `GET /api/borrows/borrowed/:borrower_id` - Get borrowed books for a borrower (Admin auth required)
- `GET /api/borrows/overdue` - Get all overdue books (Admin auth required)

#### Analytics Endpoints
- `GET /api/analytics/export/csv?startDate=<date>&endDate=<date>` - Export borrow analytics as CSV (Admin auth required)
- `GET /api/analytics/export/xlsx?startDate=<date>&endDate=<date>` - Export borrow data as Excel (Admin auth required)
- `GET /api/analytics/overdue/last-month` - Export overdue books from last month (Admin auth required)
- `GET /api/analytics/borrows/last-month` - Export all borrows from last month (Admin auth required)

### Postman Collection
A complete Postman collection is available: `Library_Management_System.postman_collection.json`

Import it into Postman to test all endpoints with pre-configured requests.

## 📁 Project Structure

```
library-management-system/
├── config/
│   ├── database.js          # Database configuration
│   └── redis.js             # Redis configuration
├── controllers/
│   ├── adminController.js   # Admin operations
│   ├── analyticsController.js # Analytics and exports
│   ├── book.js              # Book operations
│   ├── borrowController.js  # Borrow operations
│   └── borrowersController.js # Borrower operations
├── helpers/
│   └── sanitize.js          # Input sanitization utilities
├── middlewares/
│   ├── adminAuth.js         # Admin authentication middleware
│   ├── borrowerAuth.js      # Borrower authentication middleware
│   └── rateLimiter.js       # Rate limiting middleware
├── models/
│   ├── admin.js             # Admin model
│   ├── book.js              # Book model
│   ├── borrow.js            # Borrow model
│   └── borrower.js          # Borrower model
├── routes/
│   ├── adminRoutes.js       # Admin routes
│   ├── analyticsRoutes.js   # Analytics routes
│   ├── booksRoutes.js       # Book routes
│   ├── borrowersRoutes.js   # Borrower routes
│   └── borrowRoutes.js      # Borrow routes
├── tests/
│   └── books.test.js        # Book API tests
├── util/                    # Utility functions
├── validators/
│   ├── analyticsValidator.js # Analytics validation
│   ├── bookValidator.js     # Book validation
│   ├── borrowerValidator.js # Borrower validation
│   └── borrowValidator.js   # Borrow validation
├── app.js                   # Express app configuration
├── server.js                # Server entry point
└── package.json             # Dependencies and scripts
```

## 🧪 Testing

Run tests using Jest:

```bash
npm test
```

### Test Coverage
- Unit tests for book operations
- Authentication middleware is mocked for testing
- Database is reset before each test run

## 💡 Usage Examples

### 1. Create an Admin
```bash
curl -X POST http://localhost:5001/api/admin/add \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin1",
    "email": "admin@library.com",
    "password": "admin123"
  }'
```

### 2. Admin Login
```bash
curl -X POST http://localhost:5001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin1",
    "password": "admin123"
  }'
```

### 3. Create a Book
```bash
curl -X POST http://localhost:5001/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "quantity": 10,
    "shelf_location": "A1"
  }'
```

### 4. Register a Borrower
```bash
curl -X POST http://localhost:5001/api/borrowers/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 5. Checkout a Book
```bash
curl -X POST http://localhost:5001/api/borrows/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "book_id": 1,
    "borrower_id": 1,
    "due_date": "2024-12-31T23:59:59.000Z"
  }'
```

### 6. Get All Books with Pagination
```bash
curl "http://localhost:5001/api/books?page=1&limit=10"
```

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Password Hashing**: bcrypt with salt rounds
3. **Input Validation**: All inputs are validated using express-validator
4. **Input Sanitization**: Protection against XSS attacks
5. **Rate Limiting**: Redis-based rate limiting to prevent abuse
6. **Optimistic Locking**: Prevents concurrent modification issues in borrow operations

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**ibrahimElshall**

- GitHub: [@ibrahemElshal](https://github.com/ibrahemElshal)
- Repository: [library-management-system](https://github.com/ibrahemElshal/library-management-system)

## 🐛 Issues

If you encounter any issues or have suggestions, please open an issue on the [GitHub Issues page](https://github.com/ibrahemElshal/library-management-system/issues).

## 📄 Additional Documentation

- **Complete API Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Comprehensive API docs with request/response examples
- **Postman Collection**: See `Library_Management_System.postman_collection.json` - Import into Postman for easy testing
- API Endpoints (Legacy): See `Apis endPoints.docx`
- Database Setup: See `Library Db Setup.docx`
- System Workflow: See `Library Management System Workflow Doc.docx`
- System Diagram: See `library mangment system diagram.pdf`

---

**Note**: Make sure to configure your `.env` file with the correct database credentials and JWT secret before running the application.