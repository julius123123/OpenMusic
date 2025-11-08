class CollaborationHandler{
    constructor(service, validator, playlistService){
        this._service = service;
        this._validator = validator;
        this._playlistService = playlistService;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }

    async postCollaborationHandler(request, h){
        this._validator.validateCollaborationPayload(request.payload);
        
        const {playlistId, userId} = request.payload;
        const {id: credentialId} = request.auth.credentials;
        await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

        const result = await this._service.addCollaborator(playlistId, userId);

        const response = h.response({
            status: 'success',
            data: {
                collaborationId: result,
            }
        });
        response.code(201);
        
        return response;
    }

    async deleteCollaborationHandler(request, h){
        this._validator.validateCollaborationPayload(request.payload);

        const {playlistId, userId} = request.payload;
        const {id: credentialId} = request.auth.credentials;
        await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

        await this._service.deleteCollaborator(playlistId, userId);

        return {
            status: 'success',
            message: 'Berhasil menghapus collaborations'
        };
    }
}

module.exports = CollaborationHandler;