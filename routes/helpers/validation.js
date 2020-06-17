const Joi = require('@hapi/joi');

// Registeration Validation
const regFromValidation = (req, res, next) => {

    const schema = Joi.object({
        name: Joi.string()
            .required(),
        email: Joi.string()
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required() // set the password to have alphanumeric special characters etc later on
    });

    const {error} = schema.validate(req.body);
    if(error){
        res.status(400).json({
            status: "Fail",
            msg: error.details[0].message
        });
    } else {
        next();
    }
}

module.exports.regFromValidation = regFromValidation;
