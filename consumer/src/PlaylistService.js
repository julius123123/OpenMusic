const {Pool} = require('pg');

class PlaylistService{
    constructor(){
        this._pool = new Pool();
    }

    async getPlaylist(playlistId){
        console.log(playlistId);
         const query1 = {
            text: 'SELECT playlists.id as id, playlists.name as name FROM playlists WHERE playlists.id = $1',
            values: [playlistId],
        }
        const result1 = await this._pool.query(query1);
        console.log(result1.rows);
        const playlist = result1.rows[0];
        console.log(playlist);

        const query = {
            text: `SELECT songs.id, songs.title, songs.performer
            FROM playlists_songs
            INNER JOIN songs ON songs.id = playlists_songs.song_id
            WHERE playlists_songs.playlist_id = $1`,
            values: [playlistId],
        }

        const result = await this._pool.query(query);

        const songs = result.rows;

        return {playlist, songs};
    }
}

module.exports = PlaylistService;