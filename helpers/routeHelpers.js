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
    validateQueryString: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.query, schema);
            if (result.error) {
                return res.status(400).json({ error: result.error.details[0].message });
            }
            if (!req.value) { req.value = {}; }
            req.value['query'] = result.value;
            next();
        }
    },

    schemas: {
        authSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().trim().min(10).required(),
            name: Joi.string().required().min(4).max(30),
        }),
        verifyEmailSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            accessCode: Joi.string().length(5).required(),
        }),
        emailSchema: Joi.object().keys({
            email: Joi.string().email().required()
        }),
        authSchemaSignIn: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().trim().min(10).required()
        }),
        blogSchema: Joi.object().keys({
            title: Joi.string().required(),
            body: Joi.string().required(),
            imageId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow('', null).required(),
        }),
        idSchema: Joi.object().keys({
            param: Joi.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/).required()  // param, becuse I named it like that above, in validateParam method
        }),
        mongoIdSchema: Joi.object().keys({
            param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required() 
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
        skipCriteriaSchema: Joi.object().keys({
            skip: Joi.number().integer().min(0).required(),
            criteria: Joi.string().regex(/^(new|mostlikedblogs|mostseenblogs|profile)$/).required()
        }),
        skipAuthorsPublicIDSchema: Joi.object().keys({
            skip: Joi.number().integer().min(0).required(),
            authorsPublicID: Joi.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/).required()
        }),
        searchCriteriaSchema: Joi.object().keys({
            searchText: Joi.string().required()
          }),

    }
}
