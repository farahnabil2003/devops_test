# Event-Driven Microservice Architecture

A scalable, event-driven microservice architecture built with Node.js, Kafka, MongoDB, and deployed using Docker and Kubernetes. This project follows Domain-Driven Design (DDD) principles and implements CQRS pattern for better scalability and maintainability.

## Architecture Overview

The system consists of the following components:

### Core Services
- **User Service**: Handles user management and authentication
- **Event Service**: Manages event creation, updates, and queries
- **Notification Service**: Handles real-time notifications and email communications
- **Search Service**: Provides event search functionality using Elasticsearch

### Infrastructure Components
- **API Gateway**: Routes requests to appropriate services
- **Message Broker**: Kafka for event streaming
- **Database**: MongoDB for data persistence
- **Search Engine**: Elasticsearch for full-text search
- **Cache**: Redis for caching frequently accessed data

## Technology Stack

- **Runtime**: Node.js
- **Message Broker**: Apache Kafka
- **Database**: MongoDB
- **Search Engine**: Elasticsearch
- **Cache**: Redis
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **API Documentation**: Swagger/OpenAPI
- **Monitoring**: Prometheus & Grafana
- **Logging**: ELK Stack

## Project Structure

```
event-driven-microservice/
├── api-gateway/           # API Gateway service
├── user-service/          # User management service
├── event-service/         # Event management service
├── notification-service/  # Notification service
├── search-service/        # Search service
├── shared/               # Shared utilities and types
├── k8s/                  # Kubernetes configurations
└── docker/               # Docker configurations
```

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Kubernetes (Minikube or cloud provider)
- MongoDB
- Apache Kafka
- Redis
- Elasticsearch

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/event-driven-microservice.git
cd event-driven-microservice
```

### 2. Install Dependencies

```bash
# Install dependencies for all services
npm run install:all
```

### 3. Environment Setup

Create a `.env` file in each service directory with the required environment variables. Example configurations are provided in `.env.example` files.

### 4. Start Development Environment

```bash
# Start all services using Docker Compose
docker-compose -f docker-compose.dev.yml up
```

### 5. Access Services

- API Gateway: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api-docs
- Grafana Dashboard: http://localhost:3001
- Kibana: http://localhost:5601

## Development

### Running Tests

```bash
# Run tests for all services
npm run test:all

# Run tests for a specific service
cd user-service
npm test
```

### Code Quality

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check
```

## Deployment

### Docker Deployment

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d
```

### Kubernetes Deployment

```bash
# Apply Kubernetes configurations
kubectl apply -f k8s/
```

## API Documentation

API documentation is available at `/api-docs` endpoint when running the API Gateway. The documentation is generated using Swagger/OpenAPI specifications.

## Monitoring and Logging

- **Metrics**: Prometheus collects metrics from all services
- **Visualization**: Grafana dashboards for metrics visualization
- **Logging**: Centralized logging using ELK Stack
- **Tracing**: Distributed tracing with Jaeger

## Security

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Secure headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- [Node.js](https://nodejs.org/)
- [Apache Kafka](https://kafka.apache.org/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/) # devops_test
