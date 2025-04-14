// tools.js - 工具库存相关接口
const express = require('express');
const { Tools: Tool } = require('../models/index');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

// 获取所有工具信息（登录后可访问）
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tools = await Tool.findAll();
    res.json(tools);
  } catch (err) {
    res.status(500).json({ message: '获取工具列表失败', error: err.message });
  }
});

// 工具入库：添加新工具（仅管理员）
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, model, total_quantity } = req.body;
    // 默认可用数量等于总数量
    const tool = await Tool.create({ 
      name, 
      model, 
      total_quantity, 
      available_quantity: total_quantity 
    });
    res.status(201).json({ message: '工具添加成功', tool });
  } catch (err) {
    res.status(500).json({ message: '添加工具失败', error: err.message });
  }
});

// （可选）更新工具信息，如编辑数量等 - 仅管理员
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const toolId = req.params.id;
    const { name, model, total_quantity, available_quantity } = req.body;
    const tool = await Tool.findByPk(toolId);
    if (!tool) {
      return res.status(404).json({ message: '找不到该工具' });
    }
    // 更新字段
    if (name !== undefined) tool.name = name;
    if (model !== undefined) tool.model = model;
    if (total_quantity !== undefined) tool.total_quantity = total_quantity;
    if (available_quantity !== undefined) tool.available_quantity = available_quantity;
    // 确保可用数量不大于总数量
    if (tool.available_quantity > tool.total_quantity) {
      tool.available_quantity = tool.total_quantity;
    }
    await tool.save();
    res.json({ message: '工具信息已更新', tool });
  } catch (err) {
    res.status(500).json({ message: '更新工具失败', error: err.message });
  }
});

module.exports = router;
