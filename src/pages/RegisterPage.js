import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/userApi';
import { getUsers } from '../api/userApi';
import ProvinceSelect from '../components/common/ProvinceSelect';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    password: '',
    confirm: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.fullname || !formData.password || !formData.confirm) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }
    if (!formData.address) {
      setError('Vui lòng chọn tỉnh/thành phố!');
      return;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    if (formData.password !== formData.confirm) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      setError('Số điện thoại không hợp lệ!');
      return;
    }
    try {
      // Kiểm tra trùng fullname
      const users = await getUsers();
      const existed = users.find(u => u.fullname && u.fullname.trim().toLowerCase() === formData.fullname.trim().toLowerCase());
      if (existed) {
        setError('Họ và tên đã tồn tại!');
        return;
      }
      await registerUser(formData);
      setError('');
      alert('Đăng ký thành công!');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.wrap}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Đăng ký tài khoản</h2>
        {error && <div style={styles.error}>{error}</div>}
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Tên tài khoản *</label>
          <input
            type="text"
            name="username"
            placeholder="Nhập tên tài khoản"
            value={formData.username}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Họ và tên *</label>
          <input
            type="text"
            name="fullname"
            placeholder="Nhập họ và tên đầy đủ"
            value={formData.fullname}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Mật khẩu *</label>
          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
            value={formData.password}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Xác nhận mật khẩu *</label>
          <input
            type="password"
            name="confirm"
            placeholder="Nhập lại mật khẩu"
            value={formData.confirm}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            placeholder="Nhập số điện thoại   "
            value={formData.phone}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <ProvinceSelect
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" style={styles.btn}>Đăng ký</button>
        <div style={styles.switchText}>
          Đã có tài khoản? <Link to="/login" style={styles.link}>Đăng nhập</Link>
        </div>
      </form>
    </div>
  );
}

const styles = {
  wrap: {
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '60vh',
  },
  form: {
    background: '#fff', 
    borderRadius: 12, 
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
    padding: 32, 
    width: 400, 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 16, 
    alignItems: 'center',
  },
  title: { 
    color: '#e53935', 
    marginBottom: 8 
  },
  inputGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#333'
  },
  input: { 
    width: '100%', 
    padding: '10px 12px', 
    borderRadius: 4, 
    border: '1px solid #ccc', 
    fontSize: 16 
  },
  btn: { 
    background: '#e53935', 
    color: '#fff', 
    border: 'none', 
    borderRadius: 4, 
    padding: '10px 24px', 
    fontSize: 16, 
    fontWeight: 500, 
    cursor: 'pointer', 
    width: '100%' 
  },
  error: { 
    color: '#e53935', 
    marginBottom: 8, 
    fontWeight: 500 
  },
  switchText: { 
    marginTop: 12, 
    fontSize: 15 
  },
  link: { 
    color: '#1976d2', 
    textDecoration: 'underline', 
    fontWeight: 500 
  },
};

export default RegisterPage; 