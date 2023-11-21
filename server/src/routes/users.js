import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js"


const router = express.Router();

router.post("/register", async (req,res)=>{
    const {username, password} = req.body;
    const user = await UserModel.findOne({username})

    if(user){
        return res.json({message: "User already exists!"})
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({username, password: hashedPassword});
    await newUser.save();

    res.json({message:"User registered successsfully!"})

})
router.post("/login", async (req,res)=>{
    const {username, password} = req.body;
    const user = await UserModel.findOne({username})

    if(!user){
        return res.json({message: "User doesn't exists!"})
    }

    const isPassWordValid = await bcrypt.compare(password, user.password);
    if(!isPassWordValid){
        return res.json({message:"Username or Password is incorrect!"})
    }

    const token = jwt.sign({id:user._id}, "gangadhar hi shaktiman hai")
    res.json({token, UserId: user._id});
})


export {router as userRouter};

export const verifyToken = (req, res, next)=>{
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token, "gangadhar hi shaktiman hai", (err)=>{
            if(err) return res.sendStatus(403);
            next();
        });
    }else{
        res.sendStatus(401)
    }
}