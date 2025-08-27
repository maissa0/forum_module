# Forum Backend Application

## Prerequisites
- Java 17 or later
- MongoDB 4.4 or later
- Maven 3.6 or later

## Setup Instructions
1. Clone the repository
2. Configure MongoDB connection in `application.properties`
3. Run `mvn clean install` to build the project
4. Run `mvn spring-boot:run` to start the application

## API Endpoints
- Authentication:
  - POST /api/auth/register
  - POST /api/auth/login

- Appointments:
  - GET /api/appointments
  - POST /api/appointments
  - PUT /api/appointments/{id}
  - DELETE /api/appointments/{id}

- Comments:
  - GET /api/comments
  - POST /api/comments
  - PUT /api/comments/{id}
  - DELETE /api/comments/{id}
  - POST /api/comments/{id}/like

- Ratings:
  - POST /api/ratings
  - GET /api/ratings/{targetType}/{targetId}

- WebSocket:
  - Connect to: ws://localhost:8080/chat
  - Subscribe to: /topic/messages
  - Send to: /app/message

## Testing
Run `mvn test` to execute the unit tests.