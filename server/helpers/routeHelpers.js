const Joi = require('joi');

module.exports = {
    validateParam: (schema, name) => {
        return (req, res, next) => {
            const result = Joi.validate({ param: req.params[name] }, schema); //[name] is dynamically added property to an object
            if (result.error) {
                //error happened
                return res.status(400).json(result.error);
            } else {
                if (!req.value)      //if .value property exists we need to append new value and not to overwrite the old one. Reason is, maybe req.params has more then one property
                    req.value = {};   // create an empty object 
                if (!req.value.params)
                    req.value.params = {};
                req.value.params[name] = result.value.param;
                next();
            }
        }
    },
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                return res.status(400).json({ error: result.error.details[0].message });
            }

            if (!req.value) { req.value = {}; }
            req.value['body'] = result.value;
            next();
        }
    },

    schemas: {
        authSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().trim().min(10).required(),
            name: Joi.string().required().min(4).max(30),
        }),
        authSchemaSignIn: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().trim().min(10).required()
        }),
        blogSchema: Joi.object().keys({
            title: Joi.string().required(),
            body: Joi.string().required()
        }),
        idSchema: Joi.object().keys({
            param: Joi.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/).required()  // param, becuse I named it like that above, in validateParam method
        }),
        commentSchema: Joi.object().keys({
            author: Joi.string().required(),
            authorsPublicID: Joi.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/).required(),
            body: Joi.string().required(),
        }),

        trustSchema: Joi.object().keys({
            trust: Joi.number().integer().min(0).max(1).required()
        }),
        
        likeSchema: Joi.object().keys({
            like: Joi.number().integer().min(0).max(1).required()
        }),

    }
}



/*
schemas: {
 kako da validiram niz
var Joi = require('joi');
var service = Joi.object().keys({
  serviceName: Joi.string().required()
});

var services = Joi.array().items(service);

var test = Joi.validate([{serviceName:'service1'}, {serviceName:'service2'}],services)



        productSellerSchema: Joi.object().keys({
            seller: Joi.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/).required(),
            make: Joi.string().required(),
            model: Joi.string().required(),
            year: Joi.number().required()
        }), 
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    }           45745c60-7b1a-11e8-9c9c-2d42b21b1a3e


*/