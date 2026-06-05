# Project: High-Concurrency Movie Ticket Booking System

This document outlines the engineering standards, architecture, and design for the high-concurrency ticket booking system.

## 1. Folder Structure
```text
ticket-booking-backend/
├── prisma/
│   └── schema.prisma         # Prisma database schema and models
├── src/
│   ├── config/               # Configuration (Prisma, Redis, Queues)
│   ├── routes/               # API route definitions
│   ├── controllers/          # Request handling
│   ├── services/             # Core business logic (Transactions, Reservations)
│   ├── repositories/         # Data Access Layer (Prisma queries)
│   ├── middlewares/          # Global error handling, validation
│   ├── validations/          # Zod schemas
│   ├── utils/                # Custom error classes
│   ├── workers/              # BullMQ workers
│   ├── jobs/                 # BullMQ job definitions
│   ├── app.js                # Express application setup
│   ├── server.js             # API entry point
│   └── worker.js             # Background worker entry point
├── Dockerfile                # API & Worker image definition
├── docker-compose.yml        # Multi-container orchestration
├── .env                      # Environment variables
├── .dockerignore             # Docker build exclusions
└── package.json              # Project dependencies
```

## 2. Tech Stack
- **Node.js & Express**: Backend framework
- **PostgreSQL**: Primary relational database
- **Prisma**: Type-safe ORM
- **Redis**: In-memory store for seat reservations
- **BullMQ**: Distributed job queue for background tasks
- **Docker**: Containerization and orchestration

## 3. Architecture Rules
- **Layered Architecture**: Route -> Controller -> Service -> Repository -> Database.
- **Atomic Transactions**: All booking-related writes use Prisma transactions.
- **Reservation Layer**: Redis handles 5-minute seat locks to prevent race conditions.
- **Asynchronous Processing**: Non-critical tasks (confirmations, cleanup) are offloaded to BullMQ.

## 4. Dockerization
The project is fully containerized with four main services:
- `ticket-booking-api`: The Express server.
- `ticket-booking-worker`: Dedicated container for background jobs.
- `ticket-booking-db`: PostgreSQL instance with persistent volumes.
- `ticket-booking-redis`: Redis instance for reservations and queues.

## 5. Development Workflow
1. Clone the repository.
2. Create `.env` from template.
3. Run `docker compose up --build`.
4. Apply migrations: `docker compose exec ticket-booking-api npx prisma migrate deploy`.
