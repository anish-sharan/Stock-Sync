# StockSync

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

StockSync is a robust backend service built with Node.js, TypeScript, and Express, designed to manage and synchronize stock data efficiently. The application follows clean architecture principles and uses dependency injection for better testability and maintainability.

## ✨ Features

- **RESTful API** for stock management
- **TypeScript** for type safety
- **PostgreSQL** for data persistence
- **Dependency Injection** with InversifyJS
- **Environment-based configuration**
- **Request validation** using Zod
- **Rate limiting** for API endpoints
- **CORS** enabled
- **Request compression**

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stocksync.git
   cd stocksync
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   ```bash
   cp .env.sample .env
   ```
   Update the `.env` file with your database credentials and other configurations.

### Environment Variables

| Variable          | Description                     | Required | Default |
|-------------------|---------------------------------|----------|---------|
| PG_HOST           | PostgreSQL host                | Yes      | -       |
| PG_PORT           | PostgreSQL port                | Yes      | -       |
| PG_USER           | PostgreSQL user                | Yes      | -       |
| PG_PASSWORD       | PostgreSQL password            | Yes      | -       |
| PG_DATABASE_NAME  | PostgreSQL database name       | Yes      | -       |
| PG_LOGGING        | Enable database query logging  | No       | false   |

### Running the Application

- **Development mode** (with hot-reload):
  ```bash
  npm run dev
  # or
  yarn dev
  ```

- **Production build**:
  ```bash
  # Build the application
  npm run build
  
  # Start the server
  npm start
  ```

## 🏗 Project Structure

```
src/
├── core/              # Core application components
│   ├── config/       # Configuration management
│   ├── database/     # Database configurations and migrations
│   ├── decorators/   # Custom decorators
│   ├── errors/       # Custom error classes
│   ├── middlewares/  # Express middlewares
│   └── types/        # TypeScript type definitions
├── features/         # Feature modules
├── services/         # Business logic services
├── utils/            # Utility functions
└── index.ts          # Application entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/stocksync](https://github.com/yourusername/stocksync)
