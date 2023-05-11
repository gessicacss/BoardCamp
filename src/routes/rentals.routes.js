import { Router } from "express";
import { createRental, deleteRental, getRentals } from "../controllers/rentals.controllers.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import rentalSchema from "../schemas/rentalsSchema.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateSchema(rentalSchema), createRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;