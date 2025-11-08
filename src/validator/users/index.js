const InvariantError = require("../../exception/InvariantError");
const { UserSchema } = require("./schema")

const UsersValidator = {
    validateUserPayload: (payload) => {
        const result = UserSchema.validate(payload);

        if (result.error){
            throw new InvariantError("Gagal melakukan validasi");
        }
    }
}

module.exports = UsersValidator;