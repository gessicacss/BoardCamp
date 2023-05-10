import { Router } from "express";
import { createGames, getGames } from "../controllers/games.controllers.js";

const gamesRouter = Router()

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", createGames);

export default gamesRouter;