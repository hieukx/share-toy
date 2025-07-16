import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/userApi';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    try {
      const user = await loginUser({ username, password });
      setError('');
      if (onLogin) onLogin(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.wrap}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Đăng nhập</h2>
        {error && <div style={styles.error}>{error}</div>}
        <input
          type="text"
          placeholder="Tên tài khoản"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.btn}>Đăng nhập</button>
        <div style={styles.switchText}>
          Chưa có tài khoản? <Link to="/register" style={styles.link}>Đăng ký</Link>
        </div>
      </form>
    </div>
  );
}

const styles = {
  wrap: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh',
  },
  form: {
    background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32, width: 350, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center',
  },
  title: { color: '#1976d2', marginBottom: 8 },
  input: { width: '100%', padding: '10px 12px', borderRadius: 4, border: '1px solid #ccc', fontSize: 16 },
  btn: { background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 24px', fontSize: 16, fontWeight: 500, cursor: 'pointer', width: '100%' },
  error: { color: '#e53935', marginBottom: 8, fontWeight: 500 },
  switchText: { marginTop: 12, fontSize: 15 },
  link: { color: '#1976d2', textDecoration: 'underline', fontWeight: 500 },
};

export default LoginPage; 