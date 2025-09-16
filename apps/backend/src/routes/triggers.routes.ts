    import { Router } from "express";
import { createTrigger, getAllTriggers } from "../controllers/triggers.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";

    const router = Router();

    router.get('/all', isLoggedIn,  getAllTriggers )
    router.post('/create', createTrigger)

    export default router;