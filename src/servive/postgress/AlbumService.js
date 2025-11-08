const { nanoid } = require('nanoid');
const {Pool} = require('pg');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/notFoundError');
const mapDBtoModel = require('../../utils');

class AlbumService{
    constructor(){
        this._pool = new Pool();
    }

    async addAlbum({name, year}){
        const id = nanoid(16);

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
            values: [id, name, year],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id){
            throw new InvariantError("Gagal memasukkan ke database");
        }

        return result.rows[0].id;
    }

    async getAlbum(){
        const result = await this._pool.query("SELECT * FROM albums");
        return result.rows;
    }

    async getAlbumById(id){
        const querySong = {
            text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
            values: [id]
        };

        const queryAlbum = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        }

        const albumresult = await this._pool.query(queryAlbum);
        const songsresult = await this._pool.query(querySong);

        if (!albumresult.rows.length){
            throw new NotFoundError("Album tidak ditemukan");
        }

        return {
            album:{
                id: albumresult.rows[0].id,
                name: albumresult.rows[0].title,
                year: albumresult.rows[0].year,
                songs: songsresult.rows,
                path: albumresult.rows[0].path
            }
        };
    }

    async updateAlbumById(id, {name, year}){
        
        const query = {
            text: 'UPDATE albums SET title = $1, year = $2 WHERE id = $3 RETURNING id',
            values: [name, year, id],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length){
            throw new NotFoundError("Lagu tidak ditemukan");
        };
    }

    async deleteAlbumById(id){
        const query = {
            text:'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new NotFoundError("Gagal menghapus album");
        }
    }

    async getPathbyId(id){
        const query = {
            text: 'SELECT path FROM albums WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new NotFoundError('Gagal mendapatkan path');
        }
        
        return result.rows[0].path;
    }
}

module.exports = AlbumService;