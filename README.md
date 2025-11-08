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

## Installation
1. Clone the repository
    ```
    git clone <repository-url>
    cd OpenMusic
    ```

2. Install dependencies
   ```
   npm install
   ```
3. Set up environment variables
   Create a .env file in the root directory
   ```
    #SERVER
    PORT=5000
    HOST=localhost
    
    #PosetgreSQL
    PGUSER=your_db_user
    PGHOST=localhost
    PGPASSWORD=your_db_password
    PGDATABASE=openmusic
    PGPORT=5432
    
    #JWT
    ACCESS_TOKEN_KEY=your_access_token_secret
    REFRESH_TOKEN_KEY=your_refresh_token_secret
    ACCESS_TOKEN_AGE=1800
    
    #RABBITMQ
    RABBITMQ_SERVER=amqp://localhost
    #REDIS
    REDIS_SERVER=localhost
       
   ```
## Run
1. Start the server, at root directory
   ```
    npm start
   ```

2. Start the consumer program
   ```
   cd consumer
   node src/consumer.js
   ```
## API Endpoints
### Auth
+ POST /authentications - Login and get access token
+ PUT /authentications - Refresh access token
+ DELETE /authentications - Logout
### Users
+ POST /users - Register new user
+ GET /users/{id} - Get user by ID
### Albums
+ POST /albums - Create album
+ GET /albums/{id} - Get album by ID
+ PUT /albums/{id} - Update album
+ DELETE /albums/{id} - Delete album
+ POST /albums/{id}/covers - Upload album cover
+ POST /albums/{id}/likes - Like an album
+ DELETE /albums/{id}/likes - Unlike an album
+ GET /albums/{id}/likes - Get album likes count
### Songs
+ POST /songs - Create song
+ GET /songs - Get all songs (with optional query filters)
+ GET /songs/{id} - Get song by ID
+ PUT /songs/{id} - Update song
+ DELETE /songs/{id} - Delete song
### Playlists
+ POST /playlists - Create playlist
+ GET /playlists - Get user's playlists
+ DELETE /playlists/{id} - Delete playlist
+ POST /playlists/{id}/songs - Add song to playlist
+ GET /playlists/{id}/songs - Get playlist songs
+ DELETE /playlists/{id}/songs - Remove song from playlist
### Collaborations
+ POST /collaborations - Add collaborator to playlist
+ DELETE /collaborations - Remove collaborator
### Exports
POST /export/playlists/{playlistId} - Export playlist via email (async)
### Activities
+ GET /playlists/{id}/activities - Get playlist activity logs

## Authentication
This app uses JWT for authentication. User register through POST /users and login with POST /authentications. This will return accessToken and refreshToken. The accessToken is used in the request header for accessing protected resource. The refreshToken is used to get a new accessToken when it expired.

##  Server-Side Caching (Redis)
Album likes are cached in Redis for improved performance:

Cache Key Pattern: like:{albumId}
Cache Duration: 30 minutes (1800 seconds)
Cache Header: Responses from cache include X-Data-Source: cache header

## Asynchronous Email Export (RabbitMQ)
Playlist exports are processed asynchronously using RabbitMQ.
