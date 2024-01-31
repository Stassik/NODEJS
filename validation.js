const Joi = require('joi');

const schemaCreate = Joi.object({
    firstName: Joi.string()
        .min(3)
        .max(30)
        .required(),
    lastName: Joi.string()
        .min(3)
        .max(30)
        .required(),
    age: Joi.number()
        .min(0)
        .integer(),
    city: Joi.string()
})

function validate(req, res) {
    const result = schemaCreate.validate(req.body);
    if (result.error) {
        return res.status(404).send({ error: result.error.details });
    }
}

module.exports = validate;