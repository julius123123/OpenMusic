const routes = (handler) => [
    {
        method: 'POST',
        path: '/export/playlists/{playlistId}',
        handler: handler.postPlaylistHandler,
        options: {
            auth: 'openMusic_jwt'
        }
    }
]

module.exports = routes;