# GateZero

## Architecture

- **Gateway Manager**: NestJS-based API Gateway (Port 3000)
- **Router**: Rust-based service using Axum + Tokio (Port 3001)
- **Database**: MongoDB Atlas (shared by both services)

## Quick Start

1. **Setup Environment**

   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB Atlas connection string
   ```

2. **Start Services with Docker**

   ```bash
   docker-compose up --build
   ```

3. **Health Checks**
   - Gateway Manager: http://localhost:3000/health
   - Router: http://localhost:3001/health

### Gateway Manager (NestJS)

```bash
cd gateway-manager
npm install
npm run start:dev
```

### Router (Rust)

```bash
cd router
cargo run
```

## API Endpoints

### Gateway Manager (http://localhost:3000)

- `GET /health` - Health check

### Router (http://localhost:3001)

- `GET /health` - Health check
