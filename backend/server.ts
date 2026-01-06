import 'dotenv/config';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import {dbMiddleware} from "./middleware/index.js";
import {writerRoutes, userRoutes, readerRoutes, contentRoutes} from "./routes/index.js"
import {PORT} from "./config/index.js";
import {dbConnect} from "./config/db.config.js";

import morganConfig from "./config/morgan.config.js";

const app=express();

(async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => console.log('Server Started at port : ', PORT));
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
})();

    app.use(morganConfig);
    app.use(express.urlencoded({extended: true, limit: '8kb'}));

   app.use(cors({
        origin:'http://localhost:5173' ,
        credentials:true,
    }));

    app.use(express.json());
    app.use(cookieParser());

app.get('/',(req, res)=> res.send("Server ready"));

app.use("/api/user",userRoutes);
    app.use("/api/user/reader", readerRoutes);
    app.use("/api/user/writer", writerRoutes);
    app.use("/api/content", contentRoutes);

    app.use(dbMiddleware);
