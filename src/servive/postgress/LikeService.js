const { Pool } = require("pg");
const InvariantError = require("../../exception/InvariantError");
const NotFoundError = require("../../exception/notFoundError");
const ClientError = require("../../exception/clientError");
const LikesHandler = require("../../api/likes/handler");
const { nanoid } = require("nanoid");

class LikeService {
    constructor(){
        this._pool = new Pool();
    }

    async addLike(albumId, userId){
        let query = {
            text: 'SELECT * FROM albums WHERE id=$1',
            values: [albumId]
        };

        const album = await this._pool.query(query);

        if (!album.rows.length){
            throw new NotFoundError('Album tidak ditemukan');
        }

        const id = `album-like-${nanoid(16)}`;

        query = {
            text: 'INSERT INTO user_album_likes VALUES($1,$2, $3) RETURNING id',
            values: [id, userId, albumId]
        };

        const result = await this._pool.query(query);
        
        if (!result.rows.length){
            throw new InvariantError("Gagal menambahkan like");
        }
        return result.rows[0].id;
    }
    
    async deleteLike(albumId, userId){
        const query = {
            text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
            values: [userId, albumId],
        };
        
        const result = await this._pool.query(query);
        if (!result.rows.length){
            throw new NotFoundError('Likes tidak ditemukan');
        }
    }

    async sudahLike(albumId, userId){
        const query = {
            text: 'SELECT * FROM user_album_likes WHERE user_id=$1 AND album_id=$2',
            values: [userId, albumId],
        };

        const result = await this._pool.query(query);

        return (result.rows.length);
    }

    async getLikes(albumId) {
        const query = {
            text: 'SELECT COUNT(*) AS count FROM user_album_likes WHERE album_id=$1',
            values: [albumId],
        }

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new NotFoundError('Album tidak ditemukan');
        }
        
        return result.rows[0].count;

    }
}

module.exports = LikeService;