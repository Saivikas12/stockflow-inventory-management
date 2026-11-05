# StockFlow MVP — Beginner-Friendly Source Code

This project is a small multi-tenant inventory management application.

## Technology

- Backend: Java 17, Spring Boot 3, Spring Security, JWT, Spring Data JPA
- Database: MySQL
- Frontend: React 18, Vite, React Router, Axios, Tailwind CSS

## Folder structure

```text
stockflow-mvp/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/stockflow/
│       │   ├── auth/             # Signup, login and current-user lookup
│       │   ├── config/           # Security, CORS and API error handling
│       │   ├── dashboard/        # Dashboard summary API
│       │   ├── organization/     # Organization entity and repository
│       │   ├── product/          # Product entity, repository and API
│       │   ├── security/         # JWT creation and request validation
│       │   ├── settings/         # Organization inventory settings
│       │   └── StockFlowApplication.java
│       └── resources/
│           └── application.properties
└── frontend/
    ├── package.json
    └── src/
        ├── components/           # Reusable UI components
        ├── context/              # Login state shared across pages
        ├── pages/                # Login, signup, dashboard, products, settings
        ├── services/             # Axios API client
        ├── App.jsx
        └── main.jsx
```

## How the backend works

The request flow is:

```text
React page
   |
   | HTTP request + JWT token
   v
Controller
   |
   | validates request and gets signed-in user
   v
Repository
   |
   | reads/writes data
   v
MySQL database
```

### What each backend part means

- **Entity**: Java class mapped to a database table. `Product`, `Organization`, and `AppUser` are entities.
- **Repository**: Interface used by Spring Data JPA to query the database.
- **Controller**: Receives HTTP requests and returns HTTP responses.
- **CurrentUser**: Finds the logged-in user using the email stored in the JWT authentication.
- **JwtService**: Creates and validates JWT tokens.
- **SecurityConfig**: Allows signup/login without a token and protects the remaining API routes.

### Multi-tenant rule

Every product read, update and delete uses both the product ID and the signed-in user's organization ID. Never fetch a product by ID alone for an organization-scoped operation.

## API endpoints

| Method | Endpoint | Purpose | Login required |
|---|---|---|---|
| POST | `/api/auth/signup` | Create account and organization | No |
| POST | `/api/auth/login` | Login and receive JWT | No |
| GET | `/api/products` | List this organization's products | Yes |
| POST | `/api/products` | Create product | Yes |
| PUT | `/api/products/{id}` | Update product | Yes |
| DELETE | `/api/products/{id}` | Delete product | Yes |
| GET | `/api/dashboard` | Dashboard totals and low-stock products | Yes |
| GET | `/api/settings` | Read default low-stock threshold | Yes |
| PUT | `/api/settings` | Update default low-stock threshold | Yes |

## Run locally

### 1. Requirements

Install:
- JDK 17
- Maven 3.8+
- MySQL 8+
- Node.js 18+

### 2. Create the database

Start MySQL and run:

```sql
CREATE DATABASE stockflow;
```

### 3. Configure backend database credentials

Open `backend/src/main/resources/application.properties`.

The defaults are:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/stockflow
spring.datasource.username=root
spring.datasource.password=root
```

Change the username/password to match your local MySQL setup. The project also supports environment variables `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`.

**JWT secret:** The included secret is for local development only. Before deployment, set a long, random Base64-encoded secret using the `JWT_SECRET` environment variable. Never commit production secrets to Git.

### 4. Start backend

Open a terminal in the `backend` folder:

```bash
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`.

### 5. Start frontend

Open another terminal in the `frontend` folder:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Test the main flow

1. Open the frontend and create an account.
2. Enter an email, password and organization name.
3. Add a product with quantity `3`.
4. Set the default low-stock threshold to `5`.
5. Open the dashboard. The product should appear in the low-stock list.
6. Edit its quantity to `20`. It should no longer be listed as low stock.

## Notes and limitations

This is a learning/demo MVP, not production-ready software.

- Passwords are hashed with BCrypt.
- JWT authentication is stateless.
- Product operations are scoped to the signed-in organization.
- Password reset, email verification, staff accounts, billing, stock movement history and deployment hardening are not included.
- For a production application, use response DTOs instead of returning JPA entities directly, add database migrations, rate limiting, stronger secret management, automated tests and audit logging.
- The archive structure and source files have been prepared, but you should run `mvn test` and `npm run build` locally before using it for a demo.
