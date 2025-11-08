const joi = require('joi');

const AlbumsSchema = joi.object({
    name: joi.string().required(),
    year: joi.number().required(),
})


module.exports = {AlbumsSchema};