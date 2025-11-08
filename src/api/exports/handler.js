class ExportsHandler{
    constructor(exportService, playlistService, validator){
        this._exportService = exportService;
        this._playlistService = playlistService;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    }

    async postPlaylistHandler(request, h){
        this._validator.validatePayload(request.payload);

        const message = {
            targetEmail: request.payload.targetEmail,
            playlistId: request.params,
        };

        const {playlistId} = request.params;
        console.log({playlistId});
        const {id: credentialId} = request.auth.credentials;

 
        await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
        // const {playlist: playlistInfo, songs} = await this._service.getPlaylistSong(id);
           

        await this._exportService.sendMessage('export:playlist', JSON.stringify(message));

        const response = h.response({
            status: 'success',
            message: 'Permintaan Anda sedang kami proses',
        });

        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;