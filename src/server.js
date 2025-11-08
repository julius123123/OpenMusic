require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const path = require('path');


const albums = require('./api/albums');
const AlbumService = require('./servive/postgress/AlbumService');
const AlbumsValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongService = require('./servive/postgress/SongService');
const SongValidator = require('./validator/songs');

const users = require('./api/users');
const UserService = require('./servive/postgress/UserService');
const UsersValidator = require('./validator/users');

const auths = require('./api/auths');
const AuthService = require('./servive/postgress/AuthService');
const AuthValidator = require('./validator/auths');

const playlists = require('./api/playlists');
const PlaylistService = require('./servive/postgress/PlaylistService');
const PlaylistValidator = require('./validator/playlists');

const collaborations = require('./api/collaborators');
const CollaborationService = require('./servive/postgress/CollaboratorService');
const CollaborationValidator = require('./validator/collaborations');

const likes = require('./api/likes');
const LikeService = require('./servive/postgress/LikeService');

const activities = require('./api/activities');
const ActivityService = require('./servive/postgress/ActivityService');


const ClientError = require('./exception/clientError');
const TokenManager = require('./tokenize/tokenManager');

const Jwt = require('@hapi/jwt');
const AuthorizationError = require('./exception/AuthorizationError');

const _exports = require('./api/exports');
const ProducerService = require('./servive/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

const uploads = require('./api/uploads');
const StorageService = require('./servive/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

const CacheService = require('./servive/redis/CacheService');

const init = async () => {
    const albumService = new AlbumService();
    const songService = new SongService();
    const userService = new UserService();
    const authService = new AuthService();
    const activityService = new ActivityService();
    const playlistService = new PlaylistService(activityService);
    const collaborationService = new CollaborationService(userService, playlistService);
    const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
    const likeService = new LikeService();
    const cacheService = new CacheService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    await server.register([
        {
            plugin: Jwt
        },
        {
            plugin: Inert
        }
    ]);

    server.auth.strategy('openMusic_jwt', "jwt", {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            }
        }),

    })

    await server.register([
        {
            plugin: albums,
            options: {
                service: albumService,
                validator: AlbumsValidator,
            }
        },
        {
            plugin: songs,
            options: {
                service: songService,
                validator: SongValidator,
            }
        },
        {
            plugin: users,
            options: {
                service: userService,
                validator: UsersValidator,
            }
        },
        {
            plugin: auths,
            options: {
                authService,
                validator: AuthValidator,
                userService,
                tokenManager: TokenManager
            }
        },
        {
            plugin: playlists,
            options: {
                service: playlistService,
                validator: PlaylistValidator,
            }
        },
        {
            plugin: collaborations,
            options: {
                service: collaborationService,
                validator: CollaborationValidator,
                playlistService: playlistService,
            }
        },
        {
            plugin: activities,
            options: {
                service: activityService,
                playlistService: playlistService,
            }
        },
        {
            plugin: _exports,
            options: {
                exportService: ProducerService,
                playlistService: playlistService,
                validator: ExportsValidator,
            }
        },
        {
            plugin: uploads,
            options: {
                uploadService: storageService, 
                validator: UploadsValidator,
            }
        },
        {
            plugin: likes,
            options: {
                service: likeService,
                cacheService: cacheService,
            }
        }
])


    server.ext('onPreResponse', (request, h) =>{
    const {response} = request;

    if (response instanceof ClientError){
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      })

      newResponse.code(response.statusCode)
      return newResponse;
    }

    return h.continue;
  });
  
    await server.start();
    console.log(`Server run at ${server.info.uri}`);
}


init();