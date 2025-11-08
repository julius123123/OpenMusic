class ActivitiesHandler{
    constructor(service, playlistService){
        this._service = service;
        this.getActivitiesHandler = this.getActivitiesHandler.bind(this);
        this._playlistService = playlistService;
    }

    async getActivitiesHandler(request, h){
        const {id: playlistId} = request.params;
        const {id: credentialId} = request.auth.credentials;
        await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
        const activities = await this._service.getActivities(playlistId);

        return h.response({
            status: 'success',
            data: {
                playlistId: activities.playlistId,
                activities: activities.activities,
            }
        }).code(200);
    }
}

module.exports = ActivitiesHandler;