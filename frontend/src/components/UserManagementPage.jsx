import React, { useState, useEffect } from 'react';

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const authHeader = { 'Authorization': 'Bearer ' + token };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('http://localhost:5000/api/users', { headers: authHeader });
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          setMessage(data.message || 'cant attach user list');
        }
      } catch (err) {
        setMessage('networl error');
      }
    }
    fetchUsers();
  }, [authHeader]);

  return (
    <div>
      <h2>user management</h2>
      {message && <p>{message}</p>}
      <table border="1" cellPadding="6">
        <thead>
          <tr><th>ID</th><th>username</th><th>role</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.role === 'admin' ? '管理员' : '普通用户'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagementPage;
