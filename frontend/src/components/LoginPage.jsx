import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', isError: false });
  const navigate = useNavigate();

  const showToast = (message, isError) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword !== confirmPwd) {
      showToast('两次输入的密码不一致', true);
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: regUsername, password: regPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || 'register failed', true);
      } else {
        showToast('register sucess!to the login page...', false);
        setTimeout(() => {
          setRegUsername('');
          setRegPassword('');
          setConfirmPwd('');
          const toggle = document.getElementById('toggle');
          toggle.checked = false;
          const inner = document.querySelector('.flip-card__inner');
          inner.style.transform = 'rotateY(0deg)';
        }, 1500);
      }
    } catch (err) {
      showToast('network failed ,retry later', true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        showToast(data.message || `login failed (${res.status})`, true);
        return;
      }
      
      // 存储token和用户信息
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('userId', data.user.id);
      showToast('login sucess! loading...', false);
      setTimeout(() => navigate('/tools'), 1500);
    } catch (err) {
      showToast('network failed ,retry later', true);
    }
  };

  return (
    <div className="wrapper">
      <div className="flip-card__inner">
        <div style={{position: 'absolute', right: '130px', top: '6px', zIndex: 100}}>
          <input 
            type="checkbox" 
            className="toggle" 
            id="toggle"
            onChange={(e) => {
              const inner = document.querySelector('.flip-card__inner');
              if (e.target.checked) {
                inner.style.transform = 'rotateY(180deg)';
              } else {
                inner.style.transform = 'rotateY(0deg)';
              }
            }}
          />
          <label className="slider" htmlFor="toggle"></label>
        </div>
        {/* 登录卡片 - 正面 */}
        <div className="flip-card__front">
          <h2 className="title">LOGIN</h2>
          <form className="flip-card__form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="flip-card__input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="username"
              required
            />
            <input
              type="password"
              className="flip-card__input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="password"
              required
            />
            <button type="submit" className="flip-card__btn">login</button>
          </form>
        </div>

        {/* 注册卡片 - 背面 */}
        <div className="flip-card__back">
          <h2 className="title">REGISTER</h2>
          <form className="flip-card__form" onSubmit={handleRegister}>
            <input
              type="text"
              className="flip-card__input"
              value={regUsername}
              onChange={e => setRegUsername(e.target.value)}
              placeholder="username"
              required
            />
            <input
              type="password"
              className="flip-card__input"
              value={regPassword}
              onChange={e => setRegPassword(e.target.value)}
              placeholder="password"
              required
            />
            <input
              type="password"
              className="flip-card__input"
              value={confirmPwd}
              onChange={e => setConfirmPwd(e.target.value)}
              placeholder="confirm the password"
              required
            />
            <button type="submit" className="flip-card__btn">register</button>
          </form>
        </div>
      </div>

      {toast.show && (
        <div className="toast-notification" style={{ 
          backgroundColor: toast.isError ? 'var(--error-color)' : 'var(--accent-primary)',
          color: 'white'
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
