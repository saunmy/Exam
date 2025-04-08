// Projects model:id,name
const{ DataTypes } = require('sequelize');
module.exports = (sequelize) =>{
    const Project = sequelize.define('Project',{
        name:{type:DataTypes.STRING,allowNull:false}
    },{tableName:'projects',timestamps:false});
    return Project;
};