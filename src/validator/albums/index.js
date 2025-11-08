const { AlbumsSchema } = require("./schema")
const InvariantError = require('../../exception/InvariantError')
const AlbumsValidator = {
    validateAlbumPayload: (payload) => {
        const validationResult = AlbumsSchema.validate(payload);

        if (validationResult.error){
            throw new InvariantError("gagal validasi");
        }
    }
}

module.exports = AlbumsValidator;