// backend/routes/projects.js
const express = require('express');
const { Projects: Project } = require('../models/index');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

// 获取所有项目列表 - 登录用户均可访问
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: '获取项目列表失败', error: err.message });
  }
});

// 管理员创建新项目
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const newProject = await Project.create({ name });
    res.status(201).json({ message: '项目创建成功', project: newProject });
  } catch (err) {
    res.status(500).json({ message: '项目创建失败', error: err.message });
  }
});

module.exports = router;
