const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exception/InvariantError");
const NotFoundError = require("../../exception/notFoundError");

class ActivityService{
    constructor(){
        this._pool = new Pool();
    }

    async addActivity(playlistId, userId, songId, action, time){
        const id = `activity-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, playlistId, userId, songId, action, time],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id){
            throw new InvariantError("Gagal memasukkan aktivitas ke database");
        }

        return result.rows[0].id;
    }

    async getActivities(playlistId){
        const query = {
            text: `SELECT activities.playlist_id, users.username, songs.title, activities.action, activities.time
                   FROM activities JOIN users ON users.id = activities.user_id JOIN songs on songs.id = activities.song_id
                   WHERE activities.playlist_id = $1
                   ORDER BY activities.time ASC`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new NotFoundError("Tidak ada aktivitas ditemukan untuk playlist ini");
        }

        const activities = result.rows.map(({username, title, action, time}) => ({
            username,
            title,
            action,
            time
        }));


        return {
            playlistId,
            activities
        };
    }
}

module.exports = ActivityService;