import express from "express";
import mongoose from "mongoose";
import RecipeModel from "../models/Recipe.js";
import UserModel from "../models/User.js";
import { verifyToken } from "./users.js";

const router = express.Router();

// for getting all the saved recipes to the home page
router.get("/", async (req,res)=>{
    try{
        const response = await RecipeModel.find({});
        res.json(response)
    }catch(err){
        res.json(err)
    }
})


router.post("/", verifyToken, async (req,res)=>{

    const recipe = new RecipeModel(req.body);

    try{
        const response = await recipe.save();
        res.json(response)
    }catch(err){
        res.json(err)
    }
})

//Save recipe
router.put("/", verifyToken, async (req,res)=>{
    
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userId);
    
    try{
        user.savedRecipes.push(recipe);
        await user.save();
        res.json({savedRecipes: user.savedRecipes})
    }catch(err){
        res.json(err)
    }
})

router.get("/savedRecipes/ids/:userId", async (req,res)=>{

    

    try{
        const user = await UserModel.findById(req.params.userId)
        res.json({savedRecipes: user?.savedRecipes})
    }catch(err){
        res.json(err)
    }
})


router.get("/savedRecipes/:userId", async (req,res)=>{

    try{
        const user = await UserModel.findById(req.params.userId)
        const savedRecipes = await RecipeModel.find({
            _id: {$in: user.savedRecipes},
        })
        res.json({savedRecipes})
    }catch(err){
        res.json(err)
    }
})



export {router as recipesRouter}



