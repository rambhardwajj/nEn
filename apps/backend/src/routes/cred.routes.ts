
import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { getCredentialApis } from "../controllers/cred.controller";

const router = Router();

router.get('/get-all', getCredentialApis)

export default router