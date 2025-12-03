import express, { NextFunction, Request,Response } from "express";
import config from "./config"
import e from "express";
import { Pool } from "pg";
import initDB, { pool } from "./config/db";




const app = express();
const port =config.port ;

// Perser
app.use(express.json())
// app.use(express.urlencoded())

// for connection database from neon


// for create users


initDB();

// logger middleware

const logger =(req:Request,res:Response,next:NextFunction)=>{
    console.log(`[${new Date().toISOString()}],${req.method},${req.path}\n`);
    next();
}



// for get

app.get('/',logger, (req: Request, res: Response) => {
  res.send('Hello Next Developer!');
});

// the post for users create API

app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users(name,email) VALUES($1,$2) RETURNING *`,
      [name, email]
    );

    console.log(result.rows[0]); // Inserted row দেখার জন্য
    res.status(201).json({
      success: true,
      message: "Data inserted",
      data: result.rows[0]
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// the get for users CRUD API

app.get("/users",async(req:Request,res:Response)=>{
    const {name,email} = req.body;

    try {
        const result =await pool.query(`
            SELECT * FROM users`);
            res.status(200).json({
            success:true,
            message:"WOW user API is reading....",
            data:result.rows
        })
            
    } catch (err:any) {
        res.status(500).json({
            success:false,
            message:err.message,
            details:err
        })
    }
})

// the get for single users CRUD
app.get("/users/:id",async(req:Request,res:Response)=>{
   
    // console.log(req.params.id)

    try {
        const result =await pool.query(`SELECT * FROM users WHERE id=$1`,[req.params.id]);
           if(result.rows.length === 0){
             res.status(404).json({
            success:false,
            message:"Ahhh..User Not found."
        })
    }
    else{
            res.status(200).json({
            success:true,
            message:"Wow you can get...",
            deta:result.rows[0],
        })
           }
        
    } catch (err:any) {
          res.status(500).json({
            success:false,
            message:err.message,
            details:err
        })
    }
})

// the put for users updeting....

app.put("/users/:id",async(req:Request,res:Response)=>{
    // console.log(req.params.id)
    const {name,email} =req.body;
    try {
        const result =await pool.query(`UPDATE users SET name=$1,email=$2 WHERE id=$3 RETURNING *`,[name,email,req.params.id]);
           if(result.rows.length === 0){
             res.status(404).json({
            success:false,
            message:"SORRY..User Not found."
        })
    }
    else{
            res.status(200).json({
            success:true,
            message:"Updating Successfully...!",
            deta:result.rows[0],
        })
           }
        
    } catch (err:any) {
          res.status(500).json({
            success:false,
            message:err.message,
            details:err
        })
    }
})

// the delete for users Api
app.delete("/users/:id",async(req:Request,res:Response)=>{
   
    // console.log(req.params.id)

    try {
        const result =await pool.query(`DELETE FROM users WHERE id=$1`,[req.params.id,]);
           if(result.rowCount === 0){
             res.status(404).json({
            success:false,
            message:"Ahhh..User Not found."
        })
    }
    else{
            res.status(200).json({
            success:true,
            message:"DElete Successfully....",
            deta:result.rows,
        })
           }
        
    } catch (err:any) {
          res.status(500).json({
            success:false,
            message:err.message,
            details:err
        })
    }
})

/*====================================================================================*/

// for all todos<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// the post for todos create

app.post("/todos",async(req:Request,res:Response)=>{
    const {user_id,title} =req.body;

    try {
        const result =await pool.query(
            `INSERT INTO todos (user_id,title) VALUES($1,$2) RETURNING *`,
            [user_id,title]
        );
        res.status(201).json({
            success:true,
            message:"Created Your todos...!",
            data:result.rows[0]
        })
        
    } catch (err:any) {
        res.status(500).json({
            success:false,
            message:err.message,
            data:err
        })
    }
})

// the get for todos 

app.get("/todos",async(req:Request,res:Response)=>{
    const {name,email} = req.body;

    try {
        const result =await pool.query(`
            SELECT * FROM todos`);
            res.status(200).json({
            success:true,
            message:"Todos is created",
            data:result.rows
        })
            
    } catch (err:any) {
        res.status(500).json({
            success:false,
            message:err.message,
            details:err
        })
    }
})


// // the get for single todos CRUD
app.get("/todos/:id",async(req:Request,res:Response)=>{
   
    // console.log(req.params.id)

    try {
        const result =await pool.query(`SELECT * FROM todos WHERE id=$1`,[req.params.id]);
           if(result.rows.length === 0){
             res.status(404).json({
            success:false,
            message:"Ahhh..todos Not found."
        })
    }
    else{
            res.status(200).json({
            success:true,
            message:"create a single todos",
            deta:result.rows[0],
        })
           }
        
    } catch (err:any) {
          res.status(500).json({
            success:false,
            message:err.message,
            details:err
        })
    }
})
// the put for todos updeting....



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
