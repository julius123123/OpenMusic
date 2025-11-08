class SongsHandler{
    constructor(service, validator){
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.updateSongByIdHandler = this.updateSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }


    async postSongHandler(request, h){
        this._validator.validateSongPayload(request.payload);

        const {title, year, genre, performer, duration, albumId} = request.payload;

        const id = await this._service.addSong({title, year, genre, performer, duration, albumId});
        const response = h.response({
            status: 'success',
            data: {
                songId: id,
            }
        });

        response.code(201);
        return response;
    }

    async getSongsHandler(request, h){
        const title = request.query.title;
        const performer = request.query.performer;
        let songs;

        if (title && performer){
            songs = await this._service.getSongByTitleandPerformer(title, performer);
            
        }
        else if (title){
            songs = await this._service.getSongByTitle(title);
            
        }
        else if (performer){
            songs = await this._service.getSongByPerformer(performer);
            
        }
        else{
            songs = await this._service.getSongs();
        }
        const response = h.response({
            status: 'success',
            data: {songs},
        });
        response.code(200);
        return response;
    }

    async getSongByIdHandler(request, h){
        const {id} = request.params;

        const song = await this._service.getSongById(id);

        const response = h.response({
            status: 'success',
            data: {
                song,
            }
        });

        response.code(200);
        return response;
    }

    async updateSongByIdHandler(request, h){
        this._validator.validateSongPayload(request.payload);

        const {id} = request.params;

        let {title, year, genre, performer, duration, albumId} = request.payload;

        if (albumId === undefined){
            albumId = null;
        }

        await this._service.updateSongById(id, {title, year, genre, performer, duration, albumId});

        const response = h.response({
            status: 'success',
            message: 'yey',
        })

        response.code(200);
        return response;
    }

    async deleteSongByIdHandler(request, h){
        const {id} = request.params;

        await this._service.deleteSongById(id);

        const response = h.response({
            status: 'success',
            message: 'yey',
        })

        response.code(200);

        return response;
    }
}

module.exports = SongsHandler;