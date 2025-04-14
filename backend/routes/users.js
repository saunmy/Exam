// users.js - 管理用户（需要管理员权限）
const express = require('express');
const { User } = require('../models/index');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

// 获取用户列表（管理员权限）
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role']  // 只选择必要字段，不包括密码
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: '获取用户列表失败', error: err.message });
  }
});

module.exports = router;
