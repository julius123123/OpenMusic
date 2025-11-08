const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: handler.postLikesHandler,
        options: {
            auth: 'openMusic_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/albums/{id}/likes',
        handler: handler.deleteLikesHandler,
        options: {
            auth: 'openMusic_jwt'
        }
    },
    {
        method: 'GET',
        handler: handler.getLikesHandler,
        path: '/albums/{id}/likes',
    }
]

module.exports = routes;