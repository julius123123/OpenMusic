const { Pool } = require("pg");
const notFoundError = require("../../exception/notFoundError");
const InvariantError = require("../../exception/InvariantError");

class AuthService{
    constructor(){
        this._pool = new Pool();
    }

    async addToken(token){
        const query = {
            text: "INSERT INTO auths VALUES($1)",
            values: [token],
        }

        await this._pool.query(query);
    }

    async verifyRefreshToken(token){
        const query = {
            text: "SELECT * FROM auths WHERE token=$1",
            values: [token],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new InvariantError("Refresh Token tidak ditemukan");
        }
    }

    async deleteToken(token){
        const query = {
            text: "DELETE FROM auths WHERE token=$1",
            values: [token],
        };

        await this._pool.query(query);
    }
}

module.exports = AuthService;