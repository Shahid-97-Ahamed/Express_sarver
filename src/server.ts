import express, { Request,Response } from "express";
import {Pool} from "pg";
import dotenv from "dotenv";
import path from "path";
import e from "express";

dotenv.config({path:path.join(process.cwd(),".env")});


const app = express();
const port = 5000;

// Perser
app.use(express.json())
// app.use(express.urlencoded())

// for connection database from neon
const pool = new Pool({
    connectionString:`${process.env.CONNECTION_STR}`,
})

// for create users

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120),
      email VARCHAR(160) UNIQUE NOT NULL,
      age INT,
      phone VARCHAR(20),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT false,
      due_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
     )
       `);
};
initDB();



// for get

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Next Developer!');
});

// the post for users API

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

// the get for users API

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

// the get for single users
app.get("/users/:id",async(req:Request,res:Response)=>{
  
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
