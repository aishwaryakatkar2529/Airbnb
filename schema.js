const Joi = require("joi");

// module.exports.listingSchema = joi.object({
//     listing: joi.object({
//         title:joi.string().required(),
//         description:joi.string().required(),
//         location:joi.string().required(),
//         country:joi.string().required(),
//         price:joi.number().required().min(0),
//         image:joi.string().allow("",null),
//     }).required(),
// });

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            filename: Joi.string().optional(),
            url: Joi.string().allow("",null),
        }),
    }).required()
});

module.exports.reviewScehma  = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment :Joi.string().required(),
    }).required()
});
