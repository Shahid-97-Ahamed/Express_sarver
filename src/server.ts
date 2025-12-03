import express, { NextFunction, Request,Response } from "express";
import config from "./config"
import e from "express";
import { Pool } from "pg";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import router, { userRoutes } from "./modules/user/user.routes";
import { userControllers } from "./modules/user/user.controller";
import { todoRoutes } from "./modules/todo/todo.routes";
import { authRoute } from "./modules/auth/auth.route";

const app = express();
const port =config.port ;

// Perser
app.use(express.json())
/*or-----.>>>>*/   // app.use(express.urlencoded())

initDB();

// create users API for Database

// for get
app.get('/',logger, (req: Request, res: Response) => {
  res.send('Hello Next Developer!');
});

// the post for users create API
app.use("/users",userRoutes)

// the get for single users CRUD
app.get("/users/:id",userRoutes);

// the put for users updeting....
app.put("/users/:id",userRoutes)

// the delete for users Api
app.delete("/users/:id",userRoutes)

/*====================================================================================*/

// for all todos<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// the post for todos create

app.use("/todos",todoRoutes)

// the get for todos 

app.get("/todos",todoRoutes)

// // the get for single todos CRUD
app.get("/todos/:id",todoRoutes)
// the put for todos updeting....
app.put("/todos/:id",todoRoutes)
// delete todos

app.delete("/todos/:id",todoRoutes)

// Auth Router
app.use("/auth",authRoute);
// for not found 
// */is this one alwyes write last place*/

app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:"Route is not found",
        path:req.path
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
