import Joi from "@hapi/joi"

const  productValidation = Joi.object({
    name: Joi.string().required().uppercase(), 
    description: Joi.string().required(), 
    image: Joi.string().uri().optional(),
    category: Joi.string().required(), 
    price: Joi.number().min(0).required(),
    location: Joi.string().required(), 
    brand: Joi.string().required()
})

export default productValidation;