class UploadsHandler {
    constructor(uploadService, validator) {
        this._uploadService = uploadService;
        this._validator = validator;

        this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    }

    async postUploadImageHandler(request, h) {
        const {cover} = request.payload;
        const {id} = request.params;



        this._validator.validateImageHeaders(cover.hapi.headers);

        const filename = await this._uploadService.writeFile(cover, cover.hapi, id);

        const response = h.response({
            status: 'success',
            message: "Sampul berhasil diunggah"
        });

        response.code(201);
        return response;
    }
}

module.exports = UploadsHandler;