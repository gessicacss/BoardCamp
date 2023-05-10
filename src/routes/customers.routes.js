import { Router } from "express";
import { createCustomers, getCustomers, getCustomersById } from "../controllers/customers.controllers.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import customerSchema from "../schemas/customers.schema.js";


const customersRouter = Router()

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomersById);
customersRouter.post("/customers", validateSchema(customerSchema), createCustomers);

export default customersRouter;