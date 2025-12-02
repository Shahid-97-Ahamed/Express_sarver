import express, { Request,Response } from "express";
import {Pool} from "pg";
import dotenv from "dotenv";
import path from "path";

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





app.get('/', (req: Request, res: Response) => {
  res.send('Hello Next Developer!');
});

// for postnpm i --save-dev @types/pg

app.post("/",(req:Request,res:Response)=>{
    console.log(req.body);

    res.status(201).json({
        sucess:true,
        message:"API is Working"
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
