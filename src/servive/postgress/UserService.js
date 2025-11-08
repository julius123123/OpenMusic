const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exception/InvariantError");
const bcrypt = require('bcrypt');
const AuthError = require('../../exception/AuthError');
const NotFoundError = require("../../exception/notFoundError");

class UserService{
    constructor(){
        this._pool = new Pool();
    }

    async addUser({username, password, fullname}){
        await this.verifyUsername(username);
        const id = `user-${nanoid(16)}`;

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashedPassword, fullname],
        }

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new InvariantError("Gagal memasukkan user");
        }

        return result.rows[0].id;
    }

    async verifyUsername(username){
        const query = {
            text: 'SELECT * FROM users WHERE username=$1',
            values: [username],
        }

        const result = await this._pool.query(query);

        if (result.rows.length != 0){
            throw new InvariantError("Username sudah digunakan");
        }
    }

    async verifyUserCredential(username, password){
        const query = {
            text: 'SELECT id, password FROM users WHERE username=$1',
            values: [username],
        };

        const result = await this._pool.query(query);
        
        if (!result.rows.length){
            throw new AuthError("Kredensial salah");
        }

        const {id, password: hashedPassword} = result.rows[0];

        const match = await bcrypt.compare(password, hashedPassword);

        if (!match){
            throw new AuthError("Kredensial salah");
        }

        return id;
    }

    async verifyUserExist(userId){
        const query = {
            text: 'SELECT * FROM users WHERE id = $1',
            values: [userId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length){
            throw new NotFoundError("User not found");
        }
    }
}

module.exports = UserService;