import React, { useState, useEffect } from 'react';

export default function TrackingPage() {
  const [records, setRecords] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', isError: false });
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const showToast = (message, isError) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        if (!token) {
          throw new Error('请先登录');
        }

        const res = await fetch('http://localhost:5000/api/records', { 
          headers: { 
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          throw new Error('登录已过期，请重新登录');
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || '获取记录失败');
        }
        const data = await res.json();
        
        // 确保数据格式正确
        const formattedRecords = data.map(record => {
          // 处理关联数据
          const tool = record.tool || record.Tool || { name: 'Unknown', model: '' };
          const user = record.user || record.User || { username: 'Unknown' };
          const project = record.project || record.Project || { name: 'Unknown' };
          
          return {
            ...record,
            Tool: tool,
            User: user,
            Project: project
          };
        });
        
        setRecords(formattedRecords);
      } catch (err) {
        console.error('Fetch records error:', err);
        showToast(err.message, true);
      }
    };

    fetchRecords();
  }, [token, showToast]);

  // 处理归还操作
  const handleReturn = async (recordId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/records/${recordId}/return`, {
        method: 'PUT',
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok) {
        // 更新记录列表中该记录的return_date
        const updatedRecords = records.map(rec => 
          rec.id === recordId ? { ...rec, return_date: (new Date()).toISOString() } : rec
        );
        setRecords(updatedRecords);
        showToast('归还成功', false);
      } else {
        showToast(data.message || '归还失败', true);
      }
    } catch (err) {
      showToast('网络错误', true);
    }
  };

  // 将记录按照是否归还分类
  const activeRecords = records.filter(r => !r.return_date);
  const returnedRecords = records.filter(r => r.return_date);

  return (
    <div>
      <h2>工具借用跟踪</h2>

      {/* 当前未归还的借用 */}
      <h3>未归还工具</h3>
      {activeRecords.length === 0 ? <p>没有未归还的工具</p> : (
      <table className="records-table">
          <thead>
            <tr>
              <th>工具</th><th>用户</th><th>项目</th><th>借用时间</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            {activeRecords.map(rec => (
              <tr key={rec.id}>
                <td>{rec.Tool ? `${rec.Tool.name} (${rec.Tool.model})` : rec.tool_id}</td>
                <td>{rec.User ? rec.User.username : rec.user_id}</td>
                <td>{rec.Project ? rec.Project.name : rec.project_id}</td>
                <td>{new Date(rec.borrow_date).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleReturn(rec.id)}>归还</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 历史归还的记录 */}
      <h3 style={{ marginTop: '20px' }}>归还历史</h3>
      {returnedRecords.length === 0 ? <p>没有归还记录</p> : (
      <table className="records-table">
          <thead>
            <tr>
              <th>工具</th><th>用户</th><th>项目</th><th>借用时间</th><th>归还时间</th>
            </tr>
          </thead>
          <tbody>
            {returnedRecords.map(rec => (
              <tr key={rec.id}>
                <td>{rec.Tool ? `${rec.Tool.name} (${rec.Tool.model})` : rec.tool_id}</td>
                <td>{rec.User ? rec.User.username : rec.user_id}</td>
                <td>{rec.Project ? rec.Project.name : rec.project_id}</td>
                <td>{new Date(rec.borrow_date).toLocaleString()}</td>
                <td>{new Date(rec.return_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {toast.show && (
        <div className={`toast ${toast.show ? 'show' : ''}`} 
             style={{ backgroundColor: toast.isError ? '#e53935' : '#1e88e5' }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
