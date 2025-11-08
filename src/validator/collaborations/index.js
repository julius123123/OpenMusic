const CollaborationPayloadSchema = require("./schema")
const InvariantError = require('../../exception/InvariantError');

const CollaborationValidator = {
    validateCollaborationPayload: (payload) => {
        const result = CollaborationPayloadSchema.validate(payload);

        if (result.error) {
            throw new InvariantError(result.error.message);
        }
    }
}

module.exports = CollaborationValidator;