# High-Concurrency Movie Ticket Booking Backend

This is a production-style backend for a movie ticket booking system, designed to handle high concurrency using Redis reservations, Prisma transactions, and asynchronous background jobs.

## Features
- **User CRUD**: Standard user management.
- **Venue & Seat Management**: Multi-venue support with seat categories (REGULAR, VIP, ACCESSIBLE).
- **Event Engine**: Schedule movies at specific venues.
- **Availability Engine**: Real-time seat status (Available, Reserved, Booked).
- **Redis Seat Reservation**: 5-minute temporary locks to prevent double-booking.
- **Atomic Bookings**: Prisma transactions for database consistency.
- **Background Jobs**: BullMQ for asynchronous booking confirmations and cleanup.
- **Dockerized**: Entire stack (API, Worker, DB, Redis) orchestrated via Docker Compose.

## Prerequisites
- Docker and Docker Compose

## Quick Start
1. **Clone the repo**
2. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=admin1234
   POSTGRES_DB=ticket_booking_db
   PORT=5000
   ```
3. **Run with Docker**
   ```bash
   docker compose up --build
   ```
4. **Apply Database Migrations**
   ```bash
   docker compose exec ticket-booking-api npx prisma migrate deploy
   ```

## API Documentation
The API is available at `http://localhost:5000`.

### Key Endpoints
- `POST /api/users`: Create user
- `POST /api/venues`: Create venue
- `POST /api/events`: Create event
- `GET /api/events/:id/availability`: Check seat status
- `POST /api/reservations`: Reserve a seat (5 min lock)
- `POST /api/bookings`: Confirm booking (requires active reservation)

## Container Architecture
- **ticket-booking-api**: Express.js server handling HTTP requests.
- **ticket-booking-worker**: Independent BullMQ worker process for background tasks.
- **ticket-booking-db**: PostgreSQL 15 instance.
- **ticket-booking-redis**: Redis 7 instance.

## Interview Preparation & Deep Dives

### 1. Why Docker?
Docker ensures "it works on my machine" translates to "it works everywhere." It encapsulates dependencies (Node version, Postgres version, etc.) into a single immutable image.

### 2. Difference between Image and Container
An **Image** is a read-only blueprint (like a class in OOP). A **Container** is a running instance of that image (like an object).

### 3. Why Docker Compose?
Compose allows us to define and run multi-container applications. Instead of starting DB, Redis, and API separately, we manage them as a single cohesive stack.

### 4. Internal Networking
Docker Compose creates a virtual network. Services communicate using their service names (e.g., `ticket-booking-db:5432`) instead of IP addresses.

### 5. Persistence and Volumes
Containers are ephemeral (data is lost when they stop). **Volumes** map a folder inside the container to the host machine, ensuring database and Redis data survives restarts.

### 6. Containerized Development
Allows developers to work on complex stacks without installing DBs or Redis locally. It also simplifies CI/CD by using the same image for testing and production.
