const ClientError = require("./clientError");

class AuthError extends ClientError{
    constructor(message){
        super(message, 401);
        this.name = 'AuthenticationError'
    }
}

module.exports = AuthError;