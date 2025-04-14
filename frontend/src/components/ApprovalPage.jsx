import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';

const ApprovalPage = ({ tools, setTools }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const fetchPendingRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/approvals', {
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      message.error('Failed to load approvals: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, action) => {
    try {
      // 先找到当前记录
      const record = records.find(r => r.id === id);
      if (!record) {
        message.error('找不到对应的申请记录');
        return;
      }
      
      console.log('处理申请记录:', record);
      console.log('工具ID:', record.tool_id);
      
      // 发送审批请求
      const res = await fetch(`http://localhost:5000/api/approvals/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: action })
      });
      
      if (!res.ok) {
        throw new Error(`审批请求失败: ${res.status}`);
      }
      
      const result = await res.json();
      message.success(`application${action === 'approved' ? 'approved' : 'rejected'}`);
      
      // 如果批准了申请，则更新工具库存
      if (action === 'approved') {
        // 获取最新的工具数据
        const toolsRes = await fetch('http://localhost:5000/api/tools', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (!toolsRes.ok) {
          throw new Error('获取工具数据失败');
        }
        
        const toolsData = await toolsRes.json();
        setTools(toolsData); // 直接使用服务器返回的最新数据
        
        console.log('工具库存已更新');
      }
      
      // 重新获取待审批记录
      fetchPendingRecords();
      
    } catch (err) {
      console.error('审批操作错误:', err);
      message.error(`action failed: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchPendingRecords();
  }, []);

  const columns = [
    {
      title: 'tool name',
      dataIndex: ['Tool', 'name'],
      key: 'tool_name',
    },
    {
      title: 'username',
      dataIndex: ['User', 'username'],
      key: 'user',
    },
    {
      title: 'project',
      dataIndex: ['Project', 'name'],
      key: 'project',
    },
    
    {
      title: 'action',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => handleApprove(record.id, 'approved')}
            style={{ 
              backgroundColor: '#1890ff', 
              color: 'white', 
              border: 'none',
              padding: '4px 15px',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          >
            approve
          </button>
          <button 
            onClick={() => handleApprove(record.id, 'rejected')}
            style={{ 
              backgroundColor: '#ff4d4f', 
              color: 'white', 
              border: 'none',
              padding: '4px 15px',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          >
            reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="approval-page" style={{ padding: 24 }}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Records to be approved</h2>
      <Table 
        columns={columns} 
        dataSource={records} 
        rowKey="id"
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: false,
          size: 'default',
          itemRender: (page, type, originalElement) => {
            if (type === 'prev') {
              return <button style={{ 
                padding: '5px 10px', 
                margin: '0 5px', 
                border: '1px solid #d9d9d9', 
                borderRadius: '2px',
                background: 'white',
                cursor: 'pointer'
              }}>上一页</button>;
            }
            if (type === 'next') {
              return <button style={{ 
                padding: '5px 10px', 
                margin: '0 5px', 
                border: '1px solid #d9d9d9', 
                borderRadius: '2px',
                background: 'white',
                cursor: 'pointer'
              }}>下一页</button>;
            }
            if (type === 'page') {
              return <button style={{ 
                padding: '5px 10px', 
                margin: '0 5px', 
                border: page === originalElement.props.current ? '1px solid #1890ff' : '1px solid #d9d9d9', 
                borderRadius: '2px',
                background: 'white',
                cursor: 'pointer',
                color: page === originalElement.props.current ? '#1890ff' : 'inherit'
              }}>{page}</button>;
            }
            return originalElement;
          }
        }}
        bordered
        style={{ boxShadow: 'none' }}
      />
    </div>
  );
};

export default ApprovalPage;
