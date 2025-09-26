import { Router } from "express";
import { getUser, handleSignInCallback, signin, signInWithGoogle, signup } from "../controllers/auth.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";

const router = Router();

router.post('/signin', signin )
router.post('/signup', signup)
router.get('/me', isLoggedIn, getUser)
router.get('/google', isLoggedIn, signInWithGoogle)
router.get('/google/callback', isLoggedIn, handleSignInCallback)


export default router