class AlbumsHandler{
    constructor(service, validator){
        this._service = service;
        this._validator = validator;

        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.updateAlbumByIdHandler = this.updateAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    }

    async postAlbumHandler(request, h){
        this._validator.validateAlbumPayload(request.payload);
        const {name, year} = request.payload;

        const id = await this._service.addAlbum({name, year});
        
        const response = h.response({
            status: 'success',
            data: {
                albumId: id
            }
        });

        response.code(201);
        return response;
    }

    async getAlbumByIdHandler(request, h){
        const {id} = request.params;

        const {album} = await this._service.getAlbumById(id);
        
        const response = h.response({
            status: "success",
            data: {
                "album": {
                    id: album.id,
                    name: album.name,
                    year: album.year,
                    songs: album.songs,
                    coverUrl: album.path
                }
            }
        });

        response.code(200);

        return response;
    }

    async updateAlbumByIdHandler(request, h){
        this._validator.validateAlbumPayload(request.payload);
        const {id} = request.params;

        const {name, year} = request.payload;

        await this._service.updateAlbumById(id, {name, year})

        const response = h.response({
            status: "success",
            message: 'hore'
        })

        return response;
    }

    async deleteAlbumByIdHandler(request, h){
        const {id} = request.params;

        await this._service.deleteAlbumById(id);
        return {
            status: 'success',
            message: 'yey',
        }
    }
}

module.exports = AlbumsHandler;