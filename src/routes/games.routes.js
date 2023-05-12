import { Router } from "express";
import { createGames, getGames } from "../controllers/games.controllers.js";
import gameSchema from "../schemas/gamesSchemas.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(gameSchema), createGames);

export default gamesRouter;
