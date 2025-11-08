const CollaborationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'collaborations',
    version: '1.0.0',
    register: async (server, { service, validator, playlistService}) => {
        const collaborationHandler = new CollaborationHandler(service, validator, playlistService);
        server.route(routes(collaborationHandler));
    }
}