const { nanoid } = require("nanoid");
const { Pool } = require("pg");

class CollaborationService{
    constructor(userService, playlistService){
        this._pool = new Pool();
        this._userService = userService;
        this._playlistService = playlistService;
    }

    async addCollaborator(playlistId, userId){
        await this._playlistService.verifyPlaylistExist(playlistId);
        await this._userService.verifyUserExist(userId);
        
        const id = `col-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO collaborations (id, playlist_id, user_id) VALUES ($1, $2, $3) RETURNING id',
            values: [id, playlistId, userId],
        };

        const result = await this._pool.query(query);
        return result.rows[0].id;
    }

    async deleteCollaborator(playlistId, userId){
        const query = {
            text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [playlistId, userId],
        }

        await this._pool.query(query);
    }
}

module.exports = CollaborationService;