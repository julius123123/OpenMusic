const fs = require('fs');
const { Pool } = require("pg");

class StorageService{
    constructor(folder){
        this._folder = folder;

        if (!fs.existsSync(folder)){
            fs.mkdirSync(folder, {recursive:true});
        }
    }

    async writeFile(file, meta, id){
        const filename = +new Date() + meta.filename;
        const path = `${this._folder}/${filename}`;

        const url = `http://${process.env.HOST}:${process.env.PORT}/albums/file/images/${filename}`;
        
        const fileStream = fs.createWriteStream(path);
        const query = {
            text: 'UPDATE albums SET path = $1 WHERE id = $2',
            values: [url, id]
        }
        
        const pool = new Pool();
        const res = await pool.query(query);

        return new Promise((resolve, reject) => {
            fileStream.on('error', (error) => reject(error));

            file.pipe(fileStream);
            file.on('end', ()=>resolve(filename));
        })
    }
}

module.exports = StorageService;