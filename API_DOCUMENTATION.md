# Library Management System - API Documentation

Complete API documentation with setup instructions, endpoint details, request/response examples, and error handling.

## Table of Contents

1. [Setup and Installation](#setup-and-installation)
2. [Authentication](#authentication)
3. [Base URL](#base-url)
4. [API Endpoints](#api-endpoints)
   - [Admin Endpoints](#admin-endpoints)
   - [Book Endpoints](#book-endpoints)
   - [Borrower Endpoints](#borrower-endpoints)
   - [Borrow Endpoints](#borrow-endpoints)
5. [Error Handling](#error-handling)
6. [Status Codes](#status-codes)

---

## Setup and Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher) OR **Docker** (v20.10 or higher)
- **Redis** (for rate limiting) OR use Docker Compose
- **npm** or **yarn**

### Option 1: Docker Installation (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/ibrahemElshal/library-management-system.git
   cd library-management-system
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Verify services are running**
   ```bash
   docker-compose ps
   ```

4. **View application logs**
   ```bash
   docker-compose logs -f app
   ```

The API will be available at `http://localhost:5001`

### Option 2: Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ibrahemElshal/library-management-system.git
   cd library-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   DB_NAME=library_db
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
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

The API will be available at `http://localhost:5001`

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require authentication.

### Getting a Token

1. **Admin Token**: Login via `POST /api/admin/login`
2. **Borrower Token**: Login via `POST /api/borrowers/login`

### Using the Token

Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

### Token Expiration

Tokens expire after 1 hour. You'll need to login again to get a new token.

---

## Base URL

```
http://localhost:5001/api
```

---

## API Endpoints

### Admin Endpoints

#### 1. Create Admin

Create a new admin user.

**Endpoint:** `POST /api/admin/add`

**Authentication:** Not required

**Request Body:**
```json
{
  "username": "admin1",
  "email": "admin@library.com",
  "password": "admin123"
}
```

**Request Example:**
```bash
curl -X POST http://localhost:5001/api/admin/add \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin1",
    "email": "admin@library.com",
    "password": "admin123"
  }'
```

**Success Response (201):**
```json
{
  "message": "Admin created successfully",
  "admin": {
    "id": 1,
    "username": "admin1",
    "email": "admin@library.com"
  }
}
```

**Error Response (500):**
```json
{
  "message": "Error message here"
}
```

---

#### 2. Admin Login

Login as admin and receive JWT token.

**Endpoint:** `POST /api/admin/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "username": "admin1",
  "password": "admin123"
}
```

**Request Example:**
```bash
curl -X POST http://localhost:5001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin1",
    "password": "admin123"
  }'
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

#### 3. Export Borrow Analytics CSV

Export borrow analytics data as CSV file.

**Endpoint:** `GET /api/admin/analytics/export/csv`

**Authentication:** Required (Admin)

**Query Parameters:**
- `startDate` (required): Start date in ISO 8601 format
- `endDate` (required): End date in ISO 8601 format

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Example:**
```bash
curl "http://localhost:5001/api/admin/analytics/export/csv?startDate=2024-01-01T00:00:00.000Z&endDate=2024-12-31T23:59:59.999Z" \
  -H "Authorization: Bearer <admin_token>" \
  -o borrow_analytics.csv
```

**Success Response (200):**
- Content-Type: `text/csv`
- File download with analytics data including:
  - Book title
  - ISBN
  - Total borrows
  - Average borrow days

**Error Response (400):**
```json
{
  "errors": [
    {
      "msg": "startDate is required",
      "param": "startDate",
      "location": "query"
    }
  ]
}
```

---

#### 4. Export Borrow Data XLSX

Export borrow data as Excel file.

**Endpoint:** `GET /api/admin/analytics/export/xlsx`

**Authentication:** Required (Admin)

**Query Parameters:**
- `startDate` (required): Start date in ISO 8601 format
- `endDate` (required): End date in ISO 8601 format

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Example:**
```bash
curl "http://localhost:5001/api/admin/analytics/export/xlsx?startDate=2024-01-01T00:00:00.000Z&endDate=2024-12-31T23:59:59.999Z" \
  -H "Authorization: Bearer <admin_token>" \
  -o borrows.xlsx
```

**Success Response (200):**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Excel file with columns:
  - Borrow ID
  - Borrower Name
  - Borrower Email
  - Book Title
  - Book ISBN
  - Borrow Date
  - Due Date
  - Return Date

---

#### 5. Export Overdue Last Month

Export overdue books from last month as CSV.

**Endpoint:** `GET /api/admin/analytics/overdue/last-month`

**Authentication:** Required (Admin)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Example:**
```bash
curl "http://localhost:5001/api/admin/analytics/overdue/last-month" \
  -H "Authorization: Bearer <admin_token>" \
  -o overdue_last_month.csv
```

**Success Response (200):**
- Content-Type: `text/csv`
- CSV file with overdue books data

---

#### 6. Export Borrows Last Month

Export all borrows from last month as CSV.

**Endpoint:** `GET /api/admin/analytics/borrows/last-month`

**Authentication:** Required (Admin)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Example:**
```bash
curl "http://localhost:5001/api/admin/analytics/borrows/last-month" \
  -H "Authorization: Bearer <admin_token>" \
  -o borrows_last_month.csv
```

**Success Response (200):**
- Content-Type: `text/csv`
- CSV file with all borrows from last month

---

### Book Endpoints

#### 7. Create Book

Create a new book in the library.

**Endpoint:** `POST /api/books`

**Authentication:** Required (Admin)

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "quantity": 10,
  "shelf_location": "A1"
}
```

**Field Validation:**
- `title`: Required, string
- `author`: Required, string
- `isbn`: Required, valid ISBN format
- `quantity`: Optional, integer >= 0 (default: 0)
- `shelf_location`: Optional, string

**Request Example:**
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

**Success Response (201):**
```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "quantity": 10,
  "shelf_location": "A1",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (400) - Validation Error:**
```json
{
  "errors": [
    {
      "msg": "Title is required",
      "param": "title",
      "location": "body"
    }
  ]
}
```

**Error Response (401) - Unauthorized:**
```json
{
  "message": "No token provided"
}
```

---

#### 8. Get All Books

Retrieve all books with pagination.

**Endpoint:** `GET /api/books`

**Authentication:** Not required

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Request Example:**
```bash
curl "http://localhost:5001/api/books?page=1&limit=10"
```

**Success Response (200):**
```json
{
  "totalItems": 25,
  "totalPages": 3,
  "currentPage": 1,
  "books": [
    {
      "id": 1,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "isbn": "9780132350884",
      "quantity": 10,
      "shelf_location": "A1",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### 9. Search Books

Search books by title, author, or ISBN.

**Endpoint:** `GET /api/books/search`

**Authentication:** Not required

**Query Parameters:**
- `query` (required): Search term

**Request Example:**
```bash
curl "http://localhost:5001/api/books/search?query=Clean"
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "quantity": 10,
    "shelf_location": "A1",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Error Response (400):**
```json
{
  "errors": [
    {
      "msg": "Search query is required",
      "param": "query",
      "location": "query"
    }
  ]
}
```

---

#### 10. Update Book

Update an existing book.

**Endpoint:** `PUT /api/books/:id`

**Authentication:** Required (Admin)

**URL Parameters:**
- `id`: Book ID

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "title": "Clean Code - Updated",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "quantity": 15,
  "shelf_location": "A2"
}
```

**Request Example:**
```bash
curl -X PUT http://localhost:5001/api/books/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "quantity": 15
  }'
```

**Success Response (200):**
```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "quantity": 15,
  "shelf_location": "A1",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "message": "Book not found"
}
```

---

#### 11. Delete Book

Delete a book from the library.

**Endpoint:** `DELETE /api/books/:id`

**Authentication:** Required (Admin)

**URL Parameters:**
- `id`: Book ID

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Example:**
```bash
curl -X DELETE http://localhost:5001/api/books/1 \
  -H "Authorization: Bearer <admin_token>"
```

**Success Response (200):**
```json
{
  "message": "Book deleted successfully"
}
```

**Error Response (404):**
```json
{
  "message": "Book not found"
}
```

---

### Borrower Endpoints

#### 12. Register Borrower

Register a new borrower.

**Endpoint:** `POST /api/borrowers/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Field Validation:**
- `name`: Required, string
- `email`: Required, valid email format
- `password`: Required, string

**Request Example:**
```bash
curl -X POST http://localhost:5001/api/borrowers/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Success Response (201):**
```json
{
  "message": "Borrower registered successfully",
  "borrower": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400) - Validation Error:**
```json
{
  "errors": [
    {
      "msg": "Email must be valid",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

#### 13. Borrower Login

Login as borrower and receive JWT token.

**Endpoint:** `POST /api/borrowers/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Request Example:**
```bash
curl -X POST http://localhost:5001/api/borrowers/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

#### 14. Get All Borrowers

Retrieve all borrowers with pagination.

**Endpoint:** `GET /api/borrowers`

**Authentication:** Required (Admin)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Example:**
```bash
curl "http://localhost:5001/api/borrowers?page=1&limit=10" \
  -H "Authorization: Bearer <admin_token>"
```

**Success Response (200):**
```json
{
  "totalItems": 15,
  "totalPages": 2,
  "currentPage": 1,
  "borrowers": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### 15. Update Borrower

Update borrower information.

**Endpoint:** `PUT /api/borrowers/:id`

**Authentication:** Not required (but recommended)

**URL Parameters:**
- `id`: Borrower ID

**Request Body (all fields optional):**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com"
}
```

**Field Validation:**
- `name`: Optional, string
- `email`: Optional, valid email format

**Request Example:**
```bash
curl -X PUT http://localhost:5001/api/borrowers/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated"
  }'
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "John Doe Updated",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "message": "Borrower not found"
}
```

---

#### 16. Delete Borrower

Delete a borrower.

**Endpoint:** `DELETE /api/borrowers/:id`

**Authentication:** Required (Admin)

**URL Parameters:**
- `id`: Borrower ID

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Example:**
```bash
curl -X DELETE http://localhost:5001/api/borrowers/1 \
  -H "Authorization: Bearer <admin_token>"
```

**Success Response (200):**
```json
{
  "message": "Borrower deleted successfully"
}
```

**Error Response (404):**
```json
{
  "message": "Borrower not found"
}
```

---

### Borrow Endpoints

#### 17. Checkout Book

Checkout (borrow) a book.

**Endpoint:** `POST /api/borrows/checkout`

**Authentication:** Not required (but rate limited)

**Request Body:**
```json
{
  "book_id": 1,
  "borrower_id": 1,
  "due_date": "2024-12-31T23:59:59.000Z"
}
```

**Field Validation:**
- `book_id`: Required, integer
- `borrower_id`: Required, integer
- `due_date`: Required, ISO 8601 date format

**Request Example:**
```bash
curl -X POST http://localhost:5001/api/borrows/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "book_id": 1,
    "borrower_id": 1,
    "due_date": "2024-12-31T23:59:59.000Z"
  }'
```

**Success Response (201):**
```json
{
  "id": 1,
  "book_id": 1,
  "borrower_id": 1,
  "borrow_date": "2024-01-15T10:30:00.000Z",
  "due_date": "2024-12-31T23:59:59.000Z",
  "return_date": null,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (400) - Book not available:**
```json
{
  "message": "Book not available"
}
```

**Error Response (404) - Book not found:**
```json
{
  "message": "Book not found"
}
```

---

#### 18. Return Book

Return a borrowed book.

**Endpoint:** `PUT /api/borrows/return/:id`

**Authentication:** Required (Borrower)

**URL Parameters:**
- `id`: Borrow record ID

**Headers:**
```
Authorization: Bearer <borrower_token>
```

**Request Example:**
```bash
curl -X PUT http://localhost:5001/api/borrows/return/1 \
  -H "Authorization: Bearer <borrower_token>"
```

**Success Response (200):**
```json
{
  "id": 1,
  "return_date": "2024-01-20T10:30:00.000Z",
  "message": "Book returned successfully"
}
```

**Error Response (400) - Already returned:**
```json
{
  "message": "Book already returned"
}
```

**Error Response (404):**
```json
{
  "message": "Borrow record not found"
}
```

**Error Response (409) - Concurrent modification:**
```json
{
  "message": "The borrow record was modified by another user. Please reload and try again."
}
```

---

#### 19. Get Borrowed Books by Borrower

Get all currently borrowed books for a specific borrower.

**Endpoint:** `GET /api/borrows/borrowed/:borrower_id`

**Authentication:** Required (Admin)

**URL Parameters:**
- `borrower_id`: Borrower ID

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Example:**
```bash
curl "http://localhost:5001/api/borrows/borrowed/1?page=1&limit=10" \
  -H "Authorization: Bearer <admin_token>"
```

**Success Response (200):**
```json
{
  "totalItems": 3,
  "totalPages": 1,
  "currentPage": 1,
  "borrows": [
    {
      "id": 1,
      "book_id": 1,
      "borrower_id": 1,
      "borrow_date": "2024-01-15T10:30:00.000Z",
      "due_date": "2024-12-31T23:59:59.000Z",
      "return_date": null,
      "Book": {
        "id": 1,
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "isbn": "9780132350884",
        "shelf_location": "A1"
      }
    }
  ]
}
```

---

#### 20. Get Overdue Books

Get all books that are overdue (not returned and past due date).

**Endpoint:** `GET /api/borrows/overdue`

**Authentication:** Required (Admin)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Example:**
```bash
curl "http://localhost:5001/api/borrows/overdue" \
  -H "Authorization: Bearer <admin_token>"
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "book_id": 1,
    "borrower_id": 1,
    "borrow_date": "2024-01-01T10:30:00.000Z",
    "due_date": "2024-01-10T23:59:59.000Z",
    "return_date": null,
    "Book": {
      "id": 1,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "isbn": "9780132350884",
      "quantity": 9,
      "shelf_location": "A1"
    }
  }
]
```

---

## Error Handling

The API uses standard HTTP status codes and returns error messages in JSON format.

### Error Response Format

```json
{
  "message": "Error message here"
}
```

For validation errors:

```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or invalid input |
| 401 | Unauthorized - Authentication required or invalid token |
| 403 | Forbidden - Invalid token |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Concurrent modification detected |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

Some endpoints are rate-limited to prevent abuse:

- **Checkout Book**: 5 requests per 60 seconds per IP
- **Add Book**: 5 requests per 60 seconds per IP

Rate limit information is stored in Redis. When rate limit is exceeded, you'll receive a 429 status code.

---

## Notes

1. **Date Format**: All dates should be in ISO 8601 format (e.g., `2024-12-31T23:59:59.000Z`)
2. **ISBN Format**: Must be a valid ISBN-10 or ISBN-13 format
3. **Pagination**: Default page size is 10 items per page
4. **Token Expiration**: JWT tokens expire after 1 hour
5. **Optimistic Locking**: Book returns use optimistic locking to prevent concurrent modification issues

---

## Postman Collection

A complete Postman collection is available: `Library_Management_System.postman_collection.json`

Import it into Postman to test all endpoints with pre-configured requests and automatic token management.

---

## Support

For issues or questions, please open an issue on the [GitHub repository](https://github.com/ibrahemElshal/library-management-system/issues).

