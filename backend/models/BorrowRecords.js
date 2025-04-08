// BC model:id,userid,toolid,prid,borrowdate,returndate
const{ DataTypes } = require('sequelize');
module.exports = (sequelize) =>{
    const BorrowRecords = sequelize.define('BorrowRecords',{
        user_id:{type:DataTypes.INTEGER,allowNull:false},
        tool_id:{type:DataTypes.INTEGER,allowNull:false},
        total_quantity:{type:DataTypes.INTEGER,allowNull:false},
        project_id:{type:DataTypes.INTEGER,allowNull:false},
        borrow_date:{type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW},
        return_date:{type:DataTypes.DATE,allowNull:true}}
        ,{tableName:'borrowed_records',timestamps:false});
    return BorrowRecords;
};