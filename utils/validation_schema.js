import Joi  from "@hapi/joi"



const authSchema  = Joi.object({
     username :Joi.string().uppercase().required(),
     email:Joi.string().email().lowercase().required(),
     password :Joi.string().min(10).pattern(new RegExp("^[a-zA-Z0-9]{4,}$")).required()
})

export default authSchema