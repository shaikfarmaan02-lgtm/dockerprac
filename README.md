# CRUD Docker Practice — Student Management

A small full-stack project for practising Dockerfiles, Docker Compose, and later GitHub Actions.

## Stack
- Backend: Java 17, Spring Boot, Spring Data JPA, PostgreSQL
- Frontend: React + Vite
- Containers: PostgreSQL, backend, frontend

## Folder structure
```text
CRUD-Docker-Practice/
├── Backend/       # Spring Boot CRUD REST API and Dockerfile
├── Frontend/      # React UI and Dockerfile
├── docker-compose.yml
└── .gitignore
```

## CRUD API
Base URL: `http://localhost:8080/api/students`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/students` | Create a student |
| GET | `/api/students` | List all students |
| GET | `/api/students/{id}` | Get one student |
| PUT | `/api/students/{id}` | Update a student |
| DELETE | `/api/students/{id}` | Delete a student |

Example JSON:
```json
{
  "name": "Asha",
  "email": "asha@example.com",
  "course": "CSE"
}
```

## Run the full application with Docker Compose
Install and start Docker Desktop first. Open a terminal in this project root and run:

```bash
docker compose up --build
```

Open the frontend at `http://localhost:5173`.
The backend API is at `http://localhost:8080/api/students`.
PostgreSQL is exposed on port `5432`.

Stop containers:
```bash
docker compose down
```

Stop containers and delete the database volume (this permanently deletes saved practice data):
```bash
docker compose down -v
```

## Run without Docker (optional)
You need PostgreSQL running locally with:
- database: `studentdb`
- username: `postgres`
- password: `docker`
- port: `5432`

Backend:
```bash
cd Backend
mvn spring-boot:run
```

Frontend (in a second terminal):
```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Suggested practice sequence
1. Explore the API and perform all five CRUD operations.
2. Read `Backend/Dockerfile`; build the backend image yourself.
3. Read `Frontend/Dockerfile`; build the frontend image yourself.
4. Study `docker-compose.yml` and understand the database health check, dependency, network, and volume.
5. After you understand the local Docker setup, create your own `.github/workflows/` workflow and push to your own GitHub repository.

## Notes
- No GitHub Actions workflow is included intentionally, so you can create it yourself for the assignment.
- This is a learning/demo app, not production-hardened. Credentials are sample local-development credentials.
- The backend uses `ddl-auto=update` to create/update the student table automatically for practice.
