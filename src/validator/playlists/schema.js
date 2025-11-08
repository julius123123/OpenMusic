const Joi = require("joi");

const playlistPostShcema = Joi.object({
    name: Joi.string().required(),
});

const playlistPostSongSchema = Joi.object({
    songId: Joi.string().required(),
});

const playlistDeleteSchema = Joi.object({
    songId: Joi.string().required(),
});

module.exports = {
    playlistPostShcema,
    playlistPostSongSchema,
    playlistDeleteSchema,
}