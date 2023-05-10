import { Router } from "express";
import { createCustomers, editCustomer, getCustomers, getCustomersById } from "../controllers/customers.controllers.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import customerSchema from "../schemas/customersSchema.js";


const customersRouter = Router()

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomersById);
customersRouter.post("/customers", validateSchema(customerSchema), createCustomers);
customersRouter.put("/customers/:id", validateSchema(customerSchema), editCustomer);

export default customersRouter;