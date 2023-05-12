import { Router } from "express";
import gamesRouter from "./games.routes.js";
import customersRouter from "./customers.routes.js";
import rentalsRouter from "./rentals.routes.js";

const router = Router();
router.use(gamesRouter);
router.use(customersRouter);
router.use(rentalsRouter);

export default router;
