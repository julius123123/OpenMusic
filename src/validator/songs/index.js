const { SongsSchema } = require("./schema");
const InvariantError = require("../../exception/InvariantError");

const SongsValidator = {
    validateSongPayload: (payload) => {
        const validationResult = SongsSchema.validate(payload);
        
        if (validationResult.error){
            throw new InvariantError("Validasi lagu gagal");
        }
    }
}

module.exports = SongsValidator;