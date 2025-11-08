const InvariantError = require('../../exception/InvariantError');
const { PostAuthSchema, PutAuthSchema, DeleteAuthSchema } = require("./schema")

const AuthValidator = {
    valdiatePostAuthPayload: (payload) => {
        const result = PostAuthSchema.validate(payload);

        if (result.error){
            throw new InvariantError("Payload tidak tepat");
        }
    },

    valdiatePutAuthPayload: (payload) => {
        const result = PutAuthSchema.validate(payload);

        if (result.error){
            throw new InvariantError("Payload tidak tepat");
        }
    },

    valdiateDeleteAuthPayload: (payload) => {
        const result = DeleteAuthSchema.validate(payload);

        if (result.error){
            throw new InvariantError("Payload tidak tepat");
        }
    },
}

module.exports =  AuthValidator;