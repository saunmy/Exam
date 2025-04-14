// User model:id,password,name,role
const{ DataTypes } = require('sequelize');
module.exports = (sequelize) =>{
    const User = sequelize.define('User',{
        username:{type:DataTypes.STRING,allowNull:false,unique:true},
        password:{type:DataTypes.STRING,allowNull:false},
        role:    {type:DataTypes.ENUM('admin','user'),allowNull:false,default:'user'}
    },{tableName:'users',timestamps:false});
    return User;
};