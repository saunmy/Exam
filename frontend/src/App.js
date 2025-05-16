import React, { useState, useEffect } from 'react';
import './index.css';
import { Routes, Route, HashRouter, Navigate, Link, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ToolsPage from './components/ToolsPage';
import TrackingPage from './components/TrackingPage';
import UserManagementPage from './components/UserManagementPage';
import ApprovalPage from './components/ApprovalPage';

function RequireAuth({ children }) {
  // 检查本地是否有登录令牌
  const token = localStorage.getItem('token');
  if (!token) {
    // 未登录，跳转到登录页
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RequireAdmin({ children }) {
  const role = localStorage.getItem('role');
  if (role !== 'admin') {
    // 非管理员，跳转到工具列表主页
    return <Navigate to="/tools" replace />;
  }
  return children;
}

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [tools, setTools] = useState([]);

  // 应用主题到根元素
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 切换主题
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // 登出功能：清除token并导航到登录页
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div>
      {/* 导航栏 */}
      <nav style={{ 
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        {token ? (
          // 如果已登录，显示功能链接和登出
          <>
            <Link to="/tools" style={{ marginRight: '15px' }}>tools repository</Link>
            <Link to="/track" style={{ marginRight: '15px' }}>tools tracking</Link>
            {role === 'admin' && (
              <>
                <Link to="/users" style={{ marginRight: '15px' }}>user management</Link>
                <Link to="/approvals" style={{ marginRight: '15px' }}>approvals</Link>
              </>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={toggleTheme}
                style={{
                  background: 'none',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                {theme === 'light' ? '🌙 dark' : '☀️ light'}
              </button>
              <button onClick={handleLogout}>log out</button>
            </div>
          </>
        ) : null}
      </nav>

      {/* 路由配置 */}
      <Routes>
        {/* 默认路由，根据是否有token跳转 */}
        <Route path="/" element={
          token ? <Navigate to="/tools" replace /> : <Navigate to="/login" replace />
        } />
        <Route path="/login" element={<LoginPage />} />
        {/* 受保护的路由 */}
        <Route path="/tools" element={
          <RequireAuth><ToolsPage tools={tools} setTools={setTools} /></RequireAuth>
        } />
        <Route path="/track" element={<RequireAuth><TrackingPage /></RequireAuth>} />
        <Route path="/users" element={
          <RequireAuth><RequireAdmin><UserManagementPage /></RequireAdmin></RequireAuth>
        } />
        <Route path="/approvals" element={
          <RequireAuth><RequireAdmin><ApprovalPage tools={tools} setTools={setTools} /></RequireAdmin></RequireAuth>
        } />
        {/* 404 未匹配路由处理 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// 用BrowserRouter封装App
export default function AppWithRouter() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}
