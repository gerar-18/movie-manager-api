# Movie Manager Api

## Running the Project Locally

### Using Docker

The project is dockerized and can be started using `docker-compose`, which will also set up the PostgreSQL database instance.

To start the project with Docker, run:

```bash
docker-compose up
```

### Without Docker

You can also run the project locally without Docker. To do this, you'll need a running PostgreSQL instance and the necessary environment variables.

## First, install the dependencies:
```bash
npm install
```

## Then, run database migrations:
```bash
npm run migration:run
```

## Then, run the project:
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Environment Variables

A `.env.example` file is provided as a template for your environment variables. Copy this file to `.env` and set the necessary values.

## Authentication in app

The project uses JWT-based authentication with role-based access control. Users must log in to receive a token, which must be included in subsequent requests to access protected routes. Guards and custom decorators are used to enforce authentication and role permissions (ADMIN, REGULAR_USER).

## Production Environment

For accessing the production environment of the application or API, use the following URL:

Production API URL: https://movie-manager-api-production.up.railway.app/api/v1

Swagger Doc: https://movie-manager-api-production.up.railway.app/api/docs


### Tests

You can run the project's tests using the provided npm command. Ensure that all test files are properly configured before executing the tests.

**Run Tests**

To run all tests, use the following command:

```bash
npm run test
```