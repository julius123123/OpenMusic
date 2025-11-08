const ExportNotesPayloadSchema = require("./schema");
const InvariantError = require('../../exception/InvariantError');

const ExportsValidator = {
    validatePayload: (payload) => {
        const result = ExportNotesPayloadSchema.validate(payload);

        if (result.error){
            throw new InvariantError(result.error.message);
        }
    }
}

module.exports = ExportsValidator;