//user registation and login
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/User');
const {secret_key} = require('../middleware/auth');
const router = express.Router();

//user registration
router.post('./register',async(req,res)=>{
    try{
        const{username,password,role} = req.body;

        //check if user is exist
        const exists = await User.findOne({where:{username}});
        if(exists){
            return res.status(400).json({message:'username exist'});
        }

        //restore the hashpassword
        const hashed = await bcrypt.hash(password,10);
        const newUser = await User.create({username,password:hashed,role:role||'user'});
        return res.status(201).json({message:'regist sucessfully'});
    }

    catch(err){
        return res.status(500).json({message:'regist failed'});

    }
});


module.exports = router;