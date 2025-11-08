const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exception/InvariantError");
const NotFoundError = require("../../exception/notFoundError");
const AuthorizationError = require("../../exception/AuthorizationError");

class PlaylistService{
    constructor(activitiesService){
        this._pool = new Pool();
        this._activitiesService = activitiesService;
    }

    async addPlaylist({name, owner}){
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new InvariantError("Gagal menambahkan playlist");
        }

        return result.rows[0].id;
    }

    async getPlaylist(owner){
        const query = {
            text: `SELECT DISTINCT playlists.id, playlists.name, users.username as username FROM playlists
            LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id JOIN users on users.id = playlists.owner
            WHERE collaborations.user_id = $1 OR playlists.owner = $1`,
            values: [owner],
        };

        const result = await this._pool.query(query);

        // if (result.rows.length){
        //     throw new NotFoundError("Playlist tidak ditemukan.");
        // }

        return result.rows;
    }

    async deletePlaylistById(playlistId){
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1',
            values: [playlistId],
        };

        await this._pool.query(query);
    }

    async postPlaylistSong(playlistId, songId, userId){
        const query1 = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [songId],
        }

        const result1 = await this._pool.query(query1);

        if (!result1.rows.length){
            throw new NotFoundError("Lagu tidak ditemukan");
        }

        const id = `playlists_songs-${nanoid(16)}`
        const query = {
            text: 'INSERT INTO playlists_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);
        
        await this._activitiesService.addActivity(playlistId, userId, songId, 'add', new Date().toISOString());

        if (!result.rows[0].id){
            throw new InvariantError("Gagal menambahkan lagu ke playlist");
        }

        return result.rows[0].id;
    }

    async getPlaylistSong(playlistId){
        const query1 = {
            text: 'SELECT playlists.id as id, playlists.name as name, users.username as username FROM playlists, users WHERE playlists.id = $1 AND users.id = playlists.owner',
            values: [playlistId],
        }

        const result1 = await this._pool.query(query1);
        
        if (!result1.rows.length){
            throw new NotFoundError("Playlist tidak ditemukan")
        }
        
        const playlist = result1.rows[0];

        const query = {
            text: `SELECT songs.id, songs.title, songs.performer
            FROM playlists, playlists_songs, songs
            WHERE playlists_songs.playlist_id = $1 AND songs.id = playlists_songs.song_id
            GROUP BY songs.id`,
            values: [playlistId],
        }

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new NotFoundError("Lagu di playlist tidak ditemukan");
        }

        const songs = result.rows;

        return {playlist, songs};
    }

    async deletePlaylistSong(playlistId, songId, userId){
        const query = {
            text: 'DELETE FROM playlists_songs WHERE playlist_id = $1 AND song_id = $2',
            values: [playlistId, songId],
        };

        await this._activitiesService.addActivity(playlistId, userId, songId, 'delete', new Date().toISOString());

        await this._pool.query(query);
    }

    async verifyPlaylistOwner(playlistId, userId){
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [playlistId],
        }

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new NotFoundError("Playlist tidak ditemukan");
        }

        const playlist = result.rows[0];

        if (playlist.owner !== userId){
            throw new AuthorizationError("Anda tidak boleh");
        }
    }

    async verifyPlaylistAccess(playlistId, userId){
        try{
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch(error) {
            if (error instanceof NotFoundError){
                throw error;
            }
            try{
                 const query = {
                    text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
                    values: [playlistId, userId],
                }

                const result = await this._pool.query(query);

                if (!result.rows.length){
                    throw new InvariantError("Kolaborasi gagal diverifikasi");
                }
            } catch{
                throw error;
            }
        }
    }

    async verifyPlaylistExist(playlistId){
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [playlistId],
        }

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new NotFoundError("Playlist tidak ditemukan");
        }
    }
}

module.exports = PlaylistService;