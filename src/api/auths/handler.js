class AuthHandler{
    constructor(authService, validator, userService, tokenManager){
        this._authService = authService;
        this._validator = validator;
        this._userService = userService;
        this._tokenManager = tokenManager;

        this.postAuthHandler = this.postAuthHandler.bind(this);
        this.putAuthHandler = this.putAuthHandler.bind(this);
        this.deleteAuthHandler = this.deleteAuthHandler.bind(this);
    }

    async postAuthHandler(request, h){
        this._validator.valdiatePostAuthPayload(request.payload);

        const {username, password} = request.payload;

        const id = await this._userService.verifyUserCredential(username, password);

        const accessToken = this._tokenManager.generateAccessToken({id});
        const refreshToken = this._tokenManager.generateRefreshToken({id});

        await this._authService.addToken(refreshToken);

        const response = h.response({
            status: 'success',
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
            }
        });
        response.code(201);

        return response;
    }

    async putAuthHandler(request, h){
        this._validator.valdiatePutAuthPayload(request.payload);

        const {refreshToken} = request.payload;

        await this._authService.verifyRefreshToken(refreshToken);

        const id = this._tokenManager.verifyRefreshToken(refreshToken);

        const accessToken = this._tokenManager.generateAccessToken({id});

        const response = h.response({
            status: 'success',
            data: {
                accessToken,
            }
        });

        response.code(200);
        return response;
    }

    async deleteAuthHandler(request, h){
        this._validator.valdiateDeleteAuthPayload(request.payload);

        const {refreshToken} = request.payload;

        await this._authService.verifyRefreshToken(refreshToken);
        await this._authService.deleteToken(refreshToken);

        return {
            status: 'success',
            message: 'berhasil menghapus refresh token',
        }
    }
}

module.exports = AuthHandler;