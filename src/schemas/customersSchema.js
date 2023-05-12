import joi from 'joi';

const customerSchema = joi.object({
    name: joi.string().trim().required(),
    phone: joi.string().trim().pattern(/^\d{10,11}$/).required(),
    cpf: joi.string().trim().length(11).pattern(/^\d+$/).required(),
    birthday: joi.date().required()
})

export default customerSchema;