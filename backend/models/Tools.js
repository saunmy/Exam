// Tool model:id,model,name,available/total quantity
const{ DataTypes } = require('sequelize');
module.exports = (sequelize) =>{
    const Tools = sequelize.define('Tools',{
        name:{type:DataTypes.STRING,allowNull:false},
        model:{type:DataTypes.STRING},
        total_quantity:{type:DataTypes.INTEGER,allowNull:false},
        available_quantity:{type:DataTypes.INTEGER,allowNull:false}}
        ,{tableName:'tools',timestamps:false});
    return Tools;
};