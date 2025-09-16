
import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { getCredentialApis, createCredentials, getAllCredentials, updateCredential } from "../controllers/cred.controller";

const router = Router();

router.get('/get-all', isLoggedIn, getCredentialApis)
router.post('/create', isLoggedIn, createCredentials )
router.put('/update/:credId', isLoggedIn, updateCredential )
router.get('/all', isLoggedIn, getAllCredentials )

export default router