const UploadsHandler = require('./handler');
const routes = require('./rotues');

module.exports = {
    name: 'uplaods',
    version: '1.0.0',
    register: async (server, {uploadService, validator}) => {
        const uploadsHandler = new UploadsHandler(uploadService, validator);
        server.route(routes(uploadsHandler));
    }
}