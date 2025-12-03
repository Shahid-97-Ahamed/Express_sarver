import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";

const router =express.Router()

router.post("/",userControllers.createUser)

router.get("/",userControllers.getUser)

// for single user

router.get("/:id",userControllers.getSingleUser);

router.put("/:id",userControllers.putUpdateUser);

router.delete("/:id", userControllers.deleteUser)

export const userRoutes =router;