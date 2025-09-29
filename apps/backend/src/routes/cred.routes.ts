
import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { getCredentialApis, createCredentials, getAllCredentials, updateCredential, deleteCredentials } from "../controllers/cred.controller";

const router = Router();

router.get('/get-all', isLoggedIn, getCredentialApis)
router.post('/create', isLoggedIn, createCredentials )
router.put('/update/:credId', isLoggedIn, updateCredential )
router.get('/all', isLoggedIn, getAllCredentials )
router.delete("/:credId", isLoggedIn, deleteCredentials);


export default router