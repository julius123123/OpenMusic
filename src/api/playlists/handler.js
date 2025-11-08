class PlaylistHandler{
    constructor(service, validator){
        this._service = service;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
        this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
        this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
        this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
    }

    async postPlaylistHandler(request, h){
        this._validator.validatePostPayload(request.payload);

        const {name} = request.payload;
        const {id: credentialId} = request.auth.credentials;
        // console.log(`id: ${credentialId}`);
        const playlistId = await this._service.addPlaylist({name, owner: credentialId});

        const response = h.response({
            status: 'success',
            data: {
                playlistId
            }
        })
        response.code(201);

        return response;
    }

    async getPlaylistHandler(request, h){
        const {id} = request.auth.credentials;

        const playlists = await this._service.getPlaylist(id);

        const response = h.response({
            status: 'success',
            data: {
                playlists,
            }
        });
        
        response.code(200);
        return response;
    }

    async deletePlaylistByIdHandler(request, h){
        const {id} = request.params;

        const {id: credentialId} = request.auth.credentials;

        await this._service.verifyPlaylistOwner(id, credentialId);
        await this._service.deletePlaylistById(id);

        const response = h.response({
            status: 'success',
            message: 'Berhasil menghapus playlist',
        });

        response.code(200);

        return response;
    }

    async postPlaylistSongHandler(request, h){
        this._validator.validatePostSongPayload(request.payload);
        
        const {id} = request.params;
        const {songId} = request.payload;
        
        const {id: credentialId} = request.auth.credentials;

        await this._service.verifyPlaylistAccess(id, credentialId);
        const result = await this._service.postPlaylistSong(id, songId, credentialId);

        // console.log(`id playlist: ${result}`)
        const response = h.response({
            status: "success",
            message: "Berhasil menambahkan lagu",
        });

        response.code(201);

        return response;
    }

    async getPlaylistSongHandler(request, h){
        const {id} = request.params;
        const {id: credentialId} = request.auth.credentials;

        await this._service.verifyPlaylistAccess(id, credentialId);
        const {playlist: playlistInfo, songs} = await this._service.getPlaylistSong(id);

        const playlist = {
            id: playlistInfo.id,
            name: playlistInfo.name,
            username: playlistInfo.username,
            songs: songs
        }

        const response = h.response({
            status: 'success',
            data: {playlist},   
        });

        response.code(200);

        return response;
    }

    async deletePlaylistSongHandler(request, h){
        this._validator.validateDeletePayload(request.payload);

        const {songId} = request.payload;
        const {id: playlistId} = request.params;
        const {id: credentialId} = request.auth.credentials;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        await this._service.deletePlaylistSong(playlistId, songId, credentialId);

        return {
            status: 'success',
            message: 'Berhasil menghapus lagu dari playlist',
        };
    }
}

module.exports = PlaylistHandler