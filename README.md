# OpenMusic API
A RESTful API for managing music albums, playlists, and user interactions built with Hapi.js, PostgreSQL, Redis, and RabbitMQ.

## Features
1. Album & Song Management - CRUD operations for albums and songs
2. Playlist Management - Create, manage, and share playlists
3. User Authentication - JWT-based authentication and authorization
4. Collaboration - Collaborative playlist editing
5. Album Likes - Like/unlike albums with server-side caching
6. Cover Album - Upload and Get album cover images
7. Export Playlists - Asynchronous playlist export via email using RabbitMQ
8. Server-side Caching - Redis cache for improved performance
## Tech Stack
1. Framework: Hapi.js
2. Database: PostgreSQL
3. Cache: Redis
4. Message Queue: RabbitMQ
5. Authentication: JWT (JSON Web Tokens)
6. Migration: node-pg-migrate
7. Validation: Joi
## Prerequisites
1. Node.js (v14 or higher)
2. PostgreSQL (v12 or higher)
3. Redis server
4. RabbitMQ server
