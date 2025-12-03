import { Result } from "pg";
import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const createUser = async (paylode:Record<string,unknown>) =>{
    const {name,email,password} =paylode;

    const hassedPass =await bcrypt.hash(password as string,10)
     const result = await pool.query(
          `INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *`,
          [name, email,hassedPass]
        );
        return result
}

const getUser = async()=>{
 const result =   await pool.query(`
            SELECT * FROM users`);
         return result    
}

const getSingelUser = async(id:string)=>{
    const result = await pool.query(`SELECT * FROM users WHERE id=$1`,[id]);
    return result

}

const putUpdateUser = async(name:string,email:string,id:string)=>{
   const result = await pool.query(`UPDATE users SET name=$1,email=$2 WHERE id=$3 RETURNING *`,[name,email,id])
    return result
}

const deleteUser =async(id:string)=>{
    const result=await pool.query(`DELETE FROM users WHERE id=$1`,[id])
    return result
}

export const userServices ={
    createUser,
    getUser,
    getSingelUser,
    putUpdateUser,
    deleteUser
}