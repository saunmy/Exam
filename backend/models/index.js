// models/index.js
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('mywebsite', 'root', '030117cyz', {
  host: 'localhost',
  dialect: 'mysql'
});

// 导入各个模型，并初始化传入 sequelize 实例
const User = require('./User')(sequelize);
const Projects = require('./Projects')(sequelize);
const Tools = require('./Tools')(sequelize);
const BorrowRecords = require('./BorrowRecords')(sequelize);

// 建立模型之间的关系
User.hasMany(BorrowRecords, { foreignKey: 'user_id' });
Tools.hasMany(BorrowRecords, { foreignKey: 'tool_id' });
Projects.hasMany(BorrowRecords, { foreignKey: 'project_id' });
BorrowRecords.belongsTo(User, { foreignKey: 'user_id' });
BorrowRecords.belongsTo(Tools, { foreignKey: 'tool_id' });
BorrowRecords.belongsTo(Projects, { foreignKey: 'project_id' });

// 导出 sequelize 实例及各个模型
module.exports = {
  sequelize,
  User,
  Projects: Projects,
  Tools: Tools, 
  BorrowRecords: BorrowRecords
};
