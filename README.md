# 🎬 Movie Manager API

A RESTful API built with NestJS to manage movies. Integrates with the SWAPI (Star Wars API), supports JWT authentication with role-based access, and includes automated synchronization and code quality tools.

![Node.js](https://img.shields.io/badge/Node.js-18.16.x-green)
![NestJS](https://img.shields.io/badge/NestJS-10.x-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue)
![Railway](https://img.shields.io/badge/Deployed%20on-Railway-purple)

## 🛠️ Environment Variables

A `.env.example` file is provided as a template for your environment variables. Copy this file to `.env` and set the necessary values.

## 🖥️ Running the Project Locally

### 🐳 Using Docker

The project is dockerized and can be started using `docker-compose`, which will also set up the PostgreSQL database instance.

To start the project with Docker, run:

```bash
docker-compose up --build
```

Once the container is up and running, open a new terminal and run the migrations manually:

 ```bash
docker exec -it <container_name> npm run migration:run
```

### 💻 Without Docker

You can also run the project locally without Docker. To do this, you'll need a running PostgreSQL instance and the necessary environment variables.

### 📦 First, install the dependencies:
```bash
npm install
```

### 🗃️ Then, run database migrations:
```bash
npm run migration:run
```

### 🔁 Then, run the project:
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 🔐 Authentication in app

The project uses JWT-based authentication with role-based access control. Users must log in to receive a token, which must be included in subsequent requests to access protected routes. Guards and custom decorators are used to enforce authentication and role permissions (ADMIN, REGULAR_USER).

## 💾 Production Environment

For accessing the production environment of the application or API, use the following URL:

Production API URL: https://movie-manager-api-production.up.railway.app/api/v1

Swagger Doc: https://movie-manager-api-production.up.railway.app/api/docs

## 🚀 Deployment

Every push to the `main` branch triggers an automatic deployment to Railway.

Production URL: [https://movie-manager-api-production.up.railway.app](https://movie-manager-api-production.up.railway.app)

## 🧪 Tests

You can run the project's tests using the provided npm command. Ensure that all test files are properly configured before executing the tests.

**Run Tests**

To run all tests, use the following command:

```bash
npm run test
```

## 📅 **Movie Synchronization**

The application includes a synchronization system to keep movie data up to date using the SWAPI (Star Wars API):

•	🕒 Scheduled Sync (Cron Job):

A cron job runs periodically in the background to fetch and store the latest films from SWAPI.

•	🌐 Manual Sync Endpoint:

You can also trigger the synchronization manually by calling the following endpoint:

```
POST /api/v1/movies/sync-swapi
```

## 🧹 Code Quality

This project enforces code quality standards through linting and formatting tools:

***Lint***

To check for linting issues:

```bash
npm run lint:check
```

***Prettier***

To verify code formatting::

```bash
npm run prettier:check
```

Uses Prettier to ensure consistent code style in src/ and test/ folders.

## 🪝 Git Hooks with Husky

Husky is integrated to run automatic checks before every commit, helping enforce code quality and prevent invalid commits from being pushed.