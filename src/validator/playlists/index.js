const { playlistDeleteSchema, playlistPostShcema, playlistPostSongSchema } = require('./schema')
const InvariantError = require('../../exception/InvariantError');
const PlaylistValidator = {
    validatePostPayload: (payload) => {
        const result = playlistPostShcema.validate(payload);
        if (result.error){
            throw new InvariantError("Payload salah")
        }
    },
    validatePostSongPayload: (payload) => {
        const result = playlistPostSongSchema.validate(payload);
        if (result.error){
            throw new InvariantError("Payload salah")
        }
    },
    validateDeletePayload: (payload) => {
        const result = playlistDeleteSchema.validate(payload);
        if (result.error){
            throw new InvariantError("Payload salah")
        }
    }
}

module.exports = PlaylistValidator;