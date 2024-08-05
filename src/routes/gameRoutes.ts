import { Router } from "express";
import { startGame, makeMove, getGameState } from "../controllers/gameController";

const router = Router();

router.post("/start", startGame);
router.post("/move", makeMove);
router.get("/state/:gameId", getGameState);

export default router;