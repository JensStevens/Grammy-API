import express from "express";
import HallOfFameController from "../controllers/hall_of_fame.js";

const router = express.Router();

router.get("/hall_of_fame", HallOfFameController.get);
router.get("/hall_of_fame/search", HallOfFameController.searchArtist);

export default router;