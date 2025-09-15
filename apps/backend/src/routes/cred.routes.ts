
import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { getCredentialApis, createCredentials, getAllCredentials } from "../controllers/cred.controller";

const router = Router();

router.get('/get-all', isLoggedIn, getCredentialApis)
router.post('/create', isLoggedIn, createCredentials )
router.get('/all', isLoggedIn, getAllCredentials )

export default router