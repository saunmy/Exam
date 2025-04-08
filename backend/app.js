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


//initialize the models
const User = require('./models/User')(sequelize);
const Projects = require('./models/Projects')(sequelize);
const Tools = require('./models/Tools')(sequelize);
const BorrowRecords = require('./models/BorrowRecords')(sequelize);


//establish the relationship between models
User.hasMany(BorrowRecords,{foreignKey:'user_id'});
Tools.hasMany(BorrowRecords,{foreignKey:'tool_id'});
Projects.hasMany(BorrowRecords,{foreignKey:'project_id'});
BorrowRecords.belongsTo(User,{foreignKey:'user_id'});
BorrowRecords.belongsTo(Tools,{foreignKey:'tool_id'});
BorrowRecords.belongsTo(Projects,{foreignKey:'project_id'});



//test database connection
sequelize.authenticate()
.then(()=>console.log("connect sucessfully"))
.catch(err=>console.error("connect failed"));




//mount  the router
app.use('/api/auth',require('./routes/auth'));



//default router(for testing)
app.get('/',(res,req)=>{
    res.setEncoding('server id running');
});


//boot the server
const port=5000;
app.listen(port,()=>{
    console.log('server is listening on port ${PORT}');
});