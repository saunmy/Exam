// app.js - Express 应用入口
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());            // 启用CORS，允许前端跨域请求
app.use(express.json());    // 解析JSON请求体

// 使用集中导出的模型和sequelize实例
const { sequelize, User, Projects, Tools, BorrowRecords } = require('./models');

// 测试数据库连接
sequelize.authenticate()
  .then(() => console.log("connect successfully"))
  .catch(err => console.error("connect failed", err));

// 挂载路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tools', require('./routes/tools'));
app.use('/api/records', require('./routes/records'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/approvals', require('./routes/approval'));
app.use('/api/test', require('./routes/test'));

// 默认测试路由
app.get('/', (req, res) => {
  res.send('Server is running');
});

// 启动服务器
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
