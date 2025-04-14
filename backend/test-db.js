const { sequelize } = require('./models/index');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    const tables = await sequelize.showAllSchemas();
    console.log('数据库表:', tables);
    
    const records = await sequelize.models.borrowed_records.findAll();
    console.log('借用记录:', records.length);
  } catch (error) {
    console.error('数据库连接失败:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();
