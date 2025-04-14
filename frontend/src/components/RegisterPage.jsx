import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', isError: false });
  const navigate = useNavigate();

  const showToast = (message, isError) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPwd) {
      showToast('please input the same password', true);
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || 'register failed', true);
      } else {
        showToast('register sucess,to the login page...', false);
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      showToast('internet failed ,retry later', true);
    }
  };

  return (
    <div>
      <h2>register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>username: </label>
        </div>
        <div>
          <label>password: </label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>confirm the password: </label>
          <input 
            type="password" 
            value={confirmPwd} 
            onChange={e => setConfirmPwd(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">register</button>
      </form>
      {toast.show && (
        <div className={`toast ${toast.show ? 'show' : ''}`} 
             style={{ backgroundColor: toast.isError ? '#e53935' : '#1e88e5' }}>
          {toast.message}
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

export default RegisterPage;
