# GateZero Portal

A modern web portal for managing your GateZero microservices infrastructure.

## Features

- **Dashboard**: Monitor system health and performance metrics
- **Gateway Management**: Configure and manage API gateway settings
- **Service Discovery**: Browse and manage registered services
- **Real-time Status**: Live monitoring of service health
- **Settings**: Configure system-wide settings

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Fetch API

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Your GateZero microservices running (Gateway Manager on port 3000, Router on port 3001)

### Installation

```bash
# Using npm
npm install

# Using bun (recommended)
bun install
```

### Development

```bash
# Using npm
npm run dev

# Using bun
bun dev
```

The portal will be available at `http://localhost:8080`

### Building for Production

```bash
# Using npm
npm run build

# Using bun
bun run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (header, sidebar, etc.)
│   └── ui/             # shadcn/ui components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── store/              # Global state management
└── main.tsx            # Application entry point
```

## Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `build:dev` - Build for development
- `preview` - Preview production build locally
- `lint` - Run ESLint

## API Integration

The portal integrates with your GateZero services:

- **Gateway Manager**: http://localhost:3000
- **Router Service**: http://localhost:3001

Make sure these services are running before starting the portal.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
