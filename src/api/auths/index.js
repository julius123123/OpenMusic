const AuthHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'auths',
    version: '1.0.0',
    register: async (server, {authService, validator, userService, tokenManager}) => {
        const authHandler = new AuthHandler(authService, validator, userService, tokenManager);

        server.route(routes(authHandler));
    }
}