//Express application entrance 
const express = require('express');
const cors = require('cors');
const{Sequelize} = require('sequelize');
 

//define express instance
const app=express();
app.use(cors());              //allow frontend Cross-origin requests
app.use(express.json())       //resolve json request


// connect the database
const sequelize = new Sequelize('mywebsite','root','123456',{
    host:'localhost',
    dialect:'mysql'

});

//test database connection
sequelize.authenticate()
.then(()=>console.log("connect sucessfully"))
.catch(err=>console.error("connect failed"));