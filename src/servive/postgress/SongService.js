const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exception/InvariantError");
const NotFoundError = require("../../exception/notFoundError");

class SongService{
    constructor(){
        this._pool = new Pool();
    }

    async addSong({title, year, genre, performer, duration, albumId}){
        const id = nanoid(16);

        const query = {
            text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
            values: [id, title, year, genre, performer, duration, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id){
            throw new InvariantError("Gagal memasuki lagu");
        }

        return result.rows[0].id;
    }

    async getSongs(){
        const result = await this._pool.query("SELECT id, title, performer FROM songs");
        return result.rows;
    }

    async getSongByTitle(title){
        const query = {
            text: "SELECT id, title, performer FROM songs WHERE title ILIKE $1",
            values: [`%${title}%`]
        }

        const result = await this._pool.query(query);
        return result.rows;
    }

    async getSongByPerformer(performer){
        const query = {
            text: "SELECT id, title, performer FROM songs WHERE performer ILIKE $1",
            values: [`%${performer}%`]
        }

        const result = await this._pool.query(query);
        return result.rows;
    }

    async getSongByTitleandPerformer(title, performer){
        const query = {
            text: "SELECT id, title, performer FROM songs WHERE performer ILIKE $1 AND title ILIKE $2",
            values: [`%${performer}%`, `%${title}%`]
        }

        const result = await this._pool.query(query);
        return result.rows;
    }



    async getSongById(id){
        const query = {
            text: "SELECT * FROM songs WHERE id = $1",
            values: [id],
        };

        const result = await this._pool.query(query);
        
        if (!result.rows.length){
            throw new NotFoundError("Song not found");
        }

        return result.rows[0];
    }
    async updateSongById(id, {title, year, genre, performer, duration, albumId}) {
        if (albumId === undefined) albumId = null;
        if (duration === undefined) duration = null;

        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 WHERE id = $7 RETURNING id',
            values: [title, year, genre, performer, duration, albumId, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new NotFoundError("Lagu tidak ditemukan");
        }
    }

    async deleteSongById(id){
        const query = {
            text: "DELETE FROM songs WHERE id = $1 RETURNING id",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new NotFoundError("Lagu tidak ditemukan");
        }
    }
    
}

module.exports = SongService;