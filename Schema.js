const Joi = require('joi');

module.exports.validListingSchema=Joi.object(
    {
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("",null),
        categories: Joi.array().items(Joi.string()).allow("",null)
    }
).required();

module.exports.validReviewSchema=Joi.object(
    {
        comment:Joi.string().required(),
        rating:Joi.number().max(5).min(1).required(),
    }
).required();