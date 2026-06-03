# Project: Ticket Booking System (Phase 1 Architecture)

This document outlines the engineering standards, architecture, and design for the initial phase of the high-concurrency ticket booking system.

## 1. Folder Structure (Target)
```text
ticket-booking-backend/
├── prisma/
│   └── schema.prisma         # Prisma database schema and models
├── src/
│   ├── config/               # Environment variables and configuration logic
│   ├── routes/               # API route definitions and HTTP method mapping
│   ├── controllers/          # Request handling, extraction, and response formatting
│   ├── services/             # Core business logic and orchestration
│   ├── repositories/         # Database interaction (Data Access Layer)
│   ├── middlewares/          # Express middlewares (error handling, logging)
│   ├── validations/          # Request payload validation schemas (e.g., Zod or Joi)
│   ├── utils/                # Helper functions, custom error classes, formatters
│   ├── app.js                # Express application setup
│   └── server.js             # Entry point, starts the HTTP server
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules
└── package.json              # Project dependencies and scripts
```

## 2. Layer Responsibilities

*   **Routes (`src/routes/`):** Matches incoming HTTP requests to Controller functions. No business logic.
*   **Controllers (`src/controllers/`):** Extracts data from the HTTP Request, calls Services, and returns HTTP Responses.
*   **Services (`src/services/`):** Core business logic engine. Orchestrates domain rules (e.g., "Max 4 seats per user").
*   **Repositories (`src/repositories/`):** Data Access Layer. Handles all direct Prisma queries.
*   **Validations (`src/validations/`):** Schema-based input validation (e.g., using Zod).
*   **Middlewares (`src/middlewares/`):** Cross-cutting concerns like global error handling and logging.

## 3. Example Request Flow: Booking a Ticket
1.  **Route** (`POST /api/bookings`) calls `BookingController.createBooking`.
2.  **Controller** extracts `{ eventId, seatId, userId }`, calls `BookingService.processBooking`.
3.  **Service** validates event existence, seat availability, and pricing. Calls `BookingRepository.create`.
4.  **Repository** executes a Prisma transaction to save the booking and lock the seat.
5.  **Controller** returns `201 Created` with the booking object.

## 4. Initial Prisma Schema Design

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String
  bookings  Booking[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Venue {
  id        Int      @id @default(autoincrement())
  name      String
  address   String
  seats     Seat[]
  events    Event[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Event {
  id          Int       @id @default(autoincrement())
  title       String
  date        DateTime
  venueId     Int
  venue       Venue     @relation(fields: [venueId], references: [id])
  bookings    Booking[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Seat {
  id        Int       @id @default(autoincrement())
  row       String
  number    Int
  type      SeatType  @default(REGULAR)
  venueId   Int
  venue     Venue     @relation(fields: [venueId], references: [id])
  bookings  Booking[]
  
  @@unique([venueId, row, number])
}

enum SeatType {
  REGULAR
  VIP
  ACCESSIBLE
}

model Booking {
  id        Int           @id @default(autoincrement())
  userId    Int
  user      User          @relation(fields: [userId], references: [id])
  eventId   Int
  event     Event         @relation(fields: [eventId], references: [id])
  seatId    Int
  seat      Seat          @relation(fields: [seatId], references: [id])
  status    BookingStatus @default(CONFIRMED)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  @@unique([eventId, seatId])
}

enum BookingStatus {
  CONFIRMED
  CANCELLED
}
```

## 5. REST API Endpoints (Phase 1)
- `POST /api/users` / `GET /api/users/:id`
- `POST /api/venues` / `POST /api/venues/:id/seats` / `GET /api/venues/:id/seats`
- `POST /api/events` / `GET /api/events` / `GET /api/events/:id/availability`
- `POST /api/bookings` / `GET /api/bookings/:id` / `DELETE /api/bookings/:id`

## 6. Recommended Development Order
1. Boilerplate (Express, Prisma, Global Error Handler).
2. Domain Models CRUD (User, Venue, Seat).
3. Events Implementation.
4. Booking Engine (Prisma Transactions).
5. Availability Engine (Joining Seats and Bookings).
6. Input Validation & Custom Errors.
