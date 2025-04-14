// BC model:id,userid,toolid,prid,borrowdate,returndate
const{ DataTypes } = require('sequelize');
module.exports = (sequelize) =>{
    const BorrowRecords = sequelize.define('borrowed_records',{
        user_id:{type:DataTypes.INTEGER,allowNull:false},
        tool_id:{type:DataTypes.INTEGER,allowNull:false},
        project_id:{type:DataTypes.INTEGER,allowNull:false},
        borrow_date:{type:DataTypes.DATE,allowNull:true},
        return_date:{type:DataTypes.DATE,allowNull:true},
        status:{
          type:DataTypes.ENUM('pending','approved','rejected'),
          allowNull:false,
          defaultValue:'pending'
        }}
        ,{timestamps:false});
    return BorrowRecords;
};
