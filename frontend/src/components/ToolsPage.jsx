import React, { useState, useEffect } from 'react';

function ToolsPage({ tools, setTools }) {
  const [projects, setProjects] = useState([]);
  const [newTool, setNewTool] = useState({ name: '', model: '', total: 1 });
  const [newProject, setNewProject] = useState({ name: '' });
  const [selectedProject, setSelectedProject] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', isError: false });

  const showToast = (message, isError) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const authHeader = React.useMemo(() => ({ 
    'Authorization': 'Bearer ' + token 
  }), [token]);

  // Get tools and projects list
  useEffect(() => {
    async function fetchData() {
      try {
        const [toolsRes, projRes] = await Promise.all([
          fetch('http://localhost:5000/api/tools', { headers: authHeader }),
          fetch('http://localhost:5000/api/projects', { headers: authHeader })
        ]);
        const toolsData = await toolsRes.json();
        const projData = await projRes.json();
        if (toolsRes.ok) setTools(toolsData);
        if (projRes.ok) {
          setProjects(projData);
          // Select first project by default
          if (projData.length > 0) setSelectedProject(projData[0].id);
        }
      } catch (err) {
        console.error('获取数据失败', err);
      }
    }
    fetchData();
  }, [authHeader]);

  // Handle admin adding new project
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({
          name: newProject.name
        })
      });
      const data = await res.json();
      if (res.ok) {
        // Add new project to list and clear input
        setProjects([...projects, data.project]);
        setNewProject({ name: '' });
        showToast('project created!', false);
      } else {
        showToast(data.message || 'failed created', true);
      }
    } catch (err) {
      showToast('network failed', true);
    }
  };

  // Handle admin adding new tool
  const handleAddTool = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({
          name: newTool.name,
          model: newTool.model,
          total_quantity: Number(newTool.total) || 1
        })
      });
      const data = await res.json();
      if (res.ok) {
        // Add new tool to list and clear input
        setTools([...tools, data.tool]);
        setNewTool({ name: '', model: '', total: 1 });
        showToast('a new tool added', false);
      } else {
        showToast(data.message || 'add failed', true);
      }
    } catch (err) {
      showToast('network failed', true);
    }
  };

  // Handle regular user borrowing tool
  const handleBorrow = async (toolId) => {
    console.log('Current selected project:', selectedProject);
    try {
      // Validate project selection
      if (!selectedProject || selectedProject === '') {
        showToast('please select a project first', true);
        return;
      }
      // Validate tool availability
      const tool = tools.find(t => t.id === toolId);
      if (!tool || tool.available_quantity < 1) {
        showToast('no remains for the tool', true);
        return;
      }

      // Ensure projectId is integer
      const projectIdInt = parseInt(selectedProject, 10);
      if (isNaN(projectIdInt)) {
        showToast('syntax error', true);
        return;
      }

        const res = await fetch('http://localhost:5000/api/records', {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          toolId: toolId, 
          projectId: projectIdInt 
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        const updatedTools = tools.map(t =>
          t.id === toolId ? { ...t, available_quantity: t.available_quantity - 1 } : t
        );
        setTools(updatedTools);
        showToast('借用申请已提交，等待管理员审批', false);
      } else {
        showToast(`borrow failed：${data.message}`, true);
      }
    } catch (err) {
      showToast(`network error,borrow failed: ${err.response?.data?.message || err.message}`, true);
    }
  };

  return (
    <div>
      <h2>Tools Inventory</h2>

      {/* 管理员项目创建表单 */}
      {role === 'admin' && (
        <form onSubmit={handleAddProject} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>create a new project</h3>
          <div>
            <label>project name: </label>
            <input 
              type="text" 
              value={newProject.name} 
              onChange={e => setNewProject({ ...newProject, name: e.target.value })} 
              required 
            />
          </div>
          <button type="submit">create</button>
        </form>
      )}

      {/* 管理员工具入库表单 */}
      {role === 'admin' && (
        <form onSubmit={handleAddTool} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>add new tools</h3>
          <div>
            <label>name: </label>
            <input 
              type="text" 
              value={newTool.name} 
              onChange={e => setNewTool({ ...newTool, name: e.target.value })} 
              required 
            />
          </div>
          <div>
            <label>type: </label>
            <input 
              type="text" 
              value={newTool.model} 
              onChange={e => setNewTool({ ...newTool, model: e.target.value })} 
            />
          </div>
          <div>
            <label>quantity: </label>
            <input 
              type="number" 
              value={newTool.total} 
              min="1"
              onChange={e => setNewTool({ ...newTool, total: e.target.value })} 
              required 
            />
          </div>
          <button type="submit">add</button>
        </form>
      )}

      {/* 普通用户：选择项目用于借用 */}
      {role === 'user' && projects.length > 0 && (
        <div style={{ margin: '10px 0' }}>
          <label>select the project: </label>
          <select 
            value={selectedProject} 
            onChange={e => {
              setSelectedProject(e.target.value);
              console.log('Selected project:', e.target.value); // 调试日志
            }}
          >
            {projects.map(proj => (
              <option key={proj.id} value={proj.id}>{proj.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* 工具列表 */}
      <h3>Tools List</h3>
      <table className="records-table">
        <thead>
          <tr><th>Name</th><th>Model</th><th>Total</th><th>Available</th><th>Action</th></tr>
        </thead>
        <tbody>
          {tools.map(tool => (
            <tr key={tool.id}>
              <td>{tool.name}</td>
              <td>{tool.model || '-'}</td>
              <td>{tool.total_quantity}</td>
              <td>{tool.available_quantity}</td>
              <td>
                {role === 'user' ? (
                  <button 
                    onClick={() => handleBorrow(tool.id)} 
                    disabled={tool.available_quantity < 1}
                  >
                    borrow
                  </button>
                ) : (
                  '---'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 项目列表 - 仅管理员可见 */}
      {role === 'admin' && (
        <div style={{ marginTop: '30px' }}>
          <h3>project list</h3>
          {projects.length === 0 ? (
            <p>no projects,please create</p>
          ) : (
            <table className="records-table">
              <thead>
                <tr><th>ID</th><th>project name</th></tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id}>
                    <td>{project.id}</td>
                    <td>{project.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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

export default ToolsPage;
