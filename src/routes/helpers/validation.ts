import {Request, Response, NextFunction} from 'express';
import Joi from '@hapi/joi';

// Registeration Validation
export default (req:Request, res:Response, next:NextFunction) => {

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
