const ActivitiesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'activities',
    version: '1.0.0',
    register: async (server, {service, playlistService}) => {
        const activitiesHandler = new ActivitiesHandler(service, playlistService);
        server.route(routes(activitiesHandler));
    }
}