import cookieParser from "cookie-parser";
import express, { urlencoded } from "express" 
import cors from "cors"
const app = express();

app.use(cookieParser())
app.use(urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

import authRouter from "./routes/auth.routes"
import credRouter from "./routes/cred.routes"
import { errorHandler } from "./middlewares/error.middleware";

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/cred',credRouter)
app.listen(8888, () =>{
    console.log("app is listening on port ", 8888)
})

app.use(errorHandler)