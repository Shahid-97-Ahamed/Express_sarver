import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.service";


const createUser =
    async (req: Request, res: Response) => {
      const { name, email,password } = req.body;
    
      try {
        const result =await userServices.createUser(req.body)
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
    }

    const getUser =async(req:Request,res:Response)=>{
    
    try {
        const result =await userServices.getUser()
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
}

const getSingleUser =async(req:Request,res:Response)=>{
   
    // console.log(req.params.id)

    try {
        const result =await userServices.getSingelUser(req.params.id!); /*as string o deya jaba*/
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
}

const putUpdateUser =async(req:Request,res:Response)=>{
    // console.log(req.params.id)
    const {name,email,id} =req.body;
    try {
        const result =await userServices.putUpdateUser(name,email,req.params.id!);
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
    
}

const deleteUser=async(req:Request,res:Response)=>{
   
    // console.log(req.params.id)

    try {
        const result =await userServices.deleteUser(req.params.id!);
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
 
}

export const userControllers ={
    createUser,
    getUser,
    getSingleUser,
    putUpdateUser,
    deleteUser
}