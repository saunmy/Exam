const express = require('express');
const { BorrowRecords, Tools, User, Projects } = require('../models');
const router = express.Router();

// 获取待审批记录
router.get('/', async (req, res) => {
  try {
    const records = await BorrowRecords.findAll({
      where: { status: 'pending' },
      include: [
        { model: User, as: 'User', attributes: ['username'] },
        { model: Tools, as: 'Tool', attributes: ['name', 'model'] },
        { model: Projects, as: 'Project', attributes: ['name'] }
      ]
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 处理审批
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const record = await BorrowRecords.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // 更新记录状态
    await record.update({ status });

    // 如果批准，减少工具可用数量
    if (status === 'approved') {
      // 直接获取工具并更新
      const tool = await Tools.findByPk(record.tool_id);
      if (tool) {
        // 设置借用日期
        await record.update({ borrow_date: new Date() });
        
        // 减少可用数量
        if (tool.available_quantity > 0) {
          await tool.decrement('available_quantity');
          await tool.save();
          console.log(`工具 ${tool.id} 可用数量已减少到 ${tool.available_quantity}`);
        } else {
          console.log(`工具 ${tool.id} 已无可用库存`);
        }
      } else {
        console.error(`找不到工具 ID: ${record.tool_id}`);
      }
    }

    // 返回更新后的记录（包含关联数据）
    const updatedRecord = await BorrowRecords.findByPk(req.params.id, {
      include: [
        { model: User, as: 'User', attributes: ['username'] },
        { model: Tools, as: 'Tool', attributes: ['name', 'model', 'available_quantity'] },
        { model: Projects, as: 'Project', attributes: ['name'] }
      ]
    });

    res.json(updatedRecord);
  } catch (err) {
    console.error('审批处理错误:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
