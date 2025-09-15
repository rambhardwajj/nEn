import { Router } from "express";
import { getUser, signin, signup } from "../controllers/auth.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";

const router = Router();

router.post('/signin', signin )
router.post('/signup', signup)
router.get('/me', isLoggedIn, getUser)


export default router