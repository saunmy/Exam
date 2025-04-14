//user registation and login
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models');
const {secret_key} = require('../middleware/auth');
const router = express.Router();

//user registration
router.post('/register', async (req, res) => {
    console.log('POST /register 路由被调用，请求体:', req.body);
    try{
        const{username,password,role} = req.body;
        
        // 验证请求参数
        if (!username || !password) {
            console.log('注册失败：用户名或密码为空');
            return res.status(400).json({message: '用户名和密码不能为空'});
        }

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
        console.error('Registration error:', err);
        return res.status(500).json({message:'register failed', error: err.message});
    }
});


// user login
router.post('/login', async (req, res) => {
    console.log('POST /login 路由被调用，请求体:', req.body);
    try {
        const { username, password } = req.body;
        
        // 验证请求参数
        if (!username || !password) {
            console.log('登录失败：用户名或密码为空');
            return res.status(400).json({message: '用户名和密码不能为空'});
        }

        const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ message: 'user not exist' });
      }
      // verify the password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: 'password not correct' });
      }
      // create the JWT which include user and psw
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role }, 
        secret_key, 
        { expiresIn: '8h' } // 8 h livetime ,token
      );
      // return token and user info
      res.json({
        message: 'log successfully',
        token: token,
        user: { id: user.id, username: user.username, role: user.role }
      });
    } catch (err) {
      res.status(500).json({ message: 'login failed', error: err.message });
    }
  });


module.exports = router;