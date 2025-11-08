class Listener {
    constructor(playlistService, mailSender){
        this._playlistService = playlistService;
        this._mailSender = mailSender;

        this.listen = this.listen.bind(this);
    }

    async listen(message){
        try{
            const {playlistId, targetEmail} = JSON.parse(message.content.toString());

            const {playlist, songs} = await this._playlistService.getPlaylist(playlistId.playlistId);
            console.log({playlist, songs});
            const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify({playlist, songs}));
            // console.log(result);
        } catch(error){
            console.error(error);
        }
    }
}

module.exports = Listener;