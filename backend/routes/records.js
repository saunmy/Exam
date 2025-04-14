// records.js - 工具借用和归还记录接口
const express = require('express');
const { User, Tools: Tool, Projects: Project, BorrowRecords: BorrowRecord } = require('../models/index');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// 借出工具（创建一条借用记录）
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('Borrow request received:', req.body);
    const userId = req.user.id;               // 当前借用人即登录用户
    const { toolId, projectId } = req.body;
    
    // 验证请求参数
    if (!toolId || !projectId) {
      console.error('Missing required fields:', { toolId, projectId });
      return res.status(400).json({ message: '缺少必要参数：工具ID和项目ID' });
    }
    
    // 验证用户是否存在
    const user = await User.findByPk(userId);
    if (!user) {
      console.error('User not found:', userId);
      return res.status(404).json({ message: '用户不存在' });
    }

    // 检查工具是否存在且有可用数量
    const tool = await Tool.findByPk(toolId);
    if (!tool) {
      console.error('Tool not found:', toolId);
      return res.status(404).json({ message: '工具不存在' });
    }
    if (tool.available_quantity < 1) {
      console.error('Tool not available:', toolId);
      return res.status(400).json({ message: '该工具已无可用库存' });
    }

    // 检查项目是否存在
    const project = await Project.findByPk(projectId);
    if (!project) {
      console.error('Project not found:', projectId);
      return res.status(404).json({ message: '项目不存在' });
    }

    console.log('Creating borrow record with:', {
      user_id: userId,
      tool_id: toolId,
      project_id: projectId
    });

    // 创建待审批记录
    const record = await BorrowRecord.create({
      user_id: userId,
      tool_id: toolId,
      project_id: projectId,
      borrow_date: null,  // 审批通过后才设置
      return_date: null,
      status: 'pending'  // 初始状态为待审批
    });
    
    console.log('Borrow request created (pending approval):', record.id);
    res.status(201).json({ 
      message: '借用申请已提交，等待管理员审批', 
      record 
    });
  } catch (err) {
    console.error('Borrow error:', err);
    const errorResponse = {
      message: '借用登记失败',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      details: err.errors ? err.errors.map(e => e.message) : null
    };
    console.error('Error response:', errorResponse);
    res.status(500).json(errorResponse);
  }
});

// 归还工具（更新借用记录）
router.put('/:id/return', authenticateToken, async (req, res) => {
  try {
    const recordId = req.params.id;
    const user = req.user;
    const record = await BorrowRecord.findByPk(recordId);
    if (!record) {
      return res.status(404).json({ message: '借用记录不存在' });
    }
    // 权限：普通用户只能归还自己的借用，管理员可归还任何记录
    if (user.role !== 'admin' && record.user_id !== user.id) {
      return res.status(403).json({ message: '没有权限归还该记录' });
    }
    if (record.return_date) {
      return res.status(400).json({ message: '该工具已归还' });
    }
    
    // 获取工具信息 - 添加这行代码
    const tool = await Tool.findByPk(record.tool_id);
    if (!tool) {
      return res.status(404).json({ message: '工具信息不存在' });
    }
    
    // 设置归还时间
    record.return_date = new Date();
    await record.save();
    
    // 工具可用数量+1
    tool.available_quantity += 1;
    // 不超过总数量
    if (tool.available_quantity > tool.total_quantity) {
      tool.available_quantity = tool.total_quantity;
    }
    await tool.save();
    
    res.json({ message: '工具归还成功', record });
  } catch (err) {
    console.error('Return error:', err);
    res.status(500).json({ message: '归还登记失败', error: err.message });
  }
});

// 获取借还记录列表（支持管理员查看全部，普通用户查看自己的）
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    let records;
    if (user.role === 'admin') {
      // 管理员查看所有已批准的借还记录
      records = await BorrowRecord.findAll({
        where: { status: 'approved' },
        include: [
          { model: User, attributes: ['username', 'role'] },
          { model: Tool, attributes: ['name', 'model'] },
          { model: Project, attributes: ['name'] }
        ],
        order: [['borrow_date', 'DESC']]
      });
    } else {
      // 普通用户只能查看自己已批准的借用记录
      records = await BorrowRecord.findAll({
        where: { 
          user_id: user.id,
          status: 'approved' 
        },
        include: [
          { model: User, attributes: ['username', 'role'] },
          { model: Tool, attributes: ['name', 'model'] },
          { model: Project, attributes: ['name'] }
        ],
        order: [['borrow_date', 'DESC']]
      });
    }
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: '获取借用记录失败', error: err.message });
  }
});

module.exports = router;
