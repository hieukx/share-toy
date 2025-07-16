import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProvinceSelect from '../components/common/ProvinceSelect';

function ProfilePage({ user, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.fullname.trim()) {
      setError('Họ và tên không được để trống!');
      return;
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      setError('Số điện thoại không hợp lệ!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:9999/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật thông tin');
      }

      const updatedUser = await response.json();
      setSuccess('Cập nhật thông tin thành công!');
      setIsEditing(false);
      
      // Cập nhật user trong localStorage và parent component
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (onUpdateProfile) {
        onUpdateProfile(updatedUser);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Có lỗi xảy ra: ' + error.message);
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword.trim()) {
      setError('Vui lòng nhập mật khẩu hiện tại!');
      return;
    }

    if (!passwordData.newPassword.trim()) {
      setError('Vui lòng nhập mật khẩu mới!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    // Kiểm tra mật khẩu hiện tại có đúng không
    try {
      const checkResponse = await fetch(`http://localhost:9999/users?username=${user.username}&password=${passwordData.currentPassword}`);
      const users = await checkResponse.json();
      
      if (users.length === 0) {
        setError('Mật khẩu hiện tại không đúng!');
        return;
      }

      // Nếu mật khẩu hiện tại đúng, tiến hành đổi mật khẩu
      const response = await fetch(`http://localhost:9999/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          password: passwordData.newPassword
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể đổi mật khẩu');
      }

      const updatedUser = await response.json();
      setSuccess('Đổi mật khẩu thành công!');
      setError(''); // Xóa error message khi thành công
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Cập nhật user trong localStorage và parent component
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (onUpdateProfile) {
        onUpdateProfile(updatedUser);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Có lỗi xảy ra: ' + error.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullname: user?.fullname || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    setError('');
    setIsEditing(false);
  };

  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError(''); // Xóa error message khi hủy
    setIsChangingPassword(false);
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Thông tin cá nhân</h2>
        <div style={styles.message}>
          Vui lòng <Link to="/login" style={styles.link}>đăng nhập</Link> để xem thông tin cá nhân.
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Thông tin cá nhân</h2>
      
      {success && <div style={styles.success}>{success}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>👤</div>
          <div style={styles.userInfo}>
            <h3 style={styles.userName}>{user.fullname}</h3>
            <p style={styles.userUsername}>@{user.username}</p>
          </div>
          {!isEditing && !isChangingPassword && (
            <div style={styles.actionButtons}>
              <button 
                onClick={() => {
                  setIsEditing(true);
                  setError(''); // Xóa error message khi chuyển form
                }}
                style={styles.editBtn}
              >
                ✏️ Chỉnh sửa
              </button>
              <button 
                onClick={() => {
                  setIsChangingPassword(true);
                  setError(''); // Xóa error message khi chuyển form
                }}
                style={styles.passwordBtn}
              >
                🔒 Đổi mật khẩu
              </button>
            </div>
          )}
        </div>

        <div style={styles.profileContent}>
          {isEditing ? (
            <div style={styles.editForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Họ và tên *</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <ProvinceSelect
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  label="Tỉnh/Thành phố"
                  name="address"
                  selectStyle={styles.select}
                />
              </div>

              <div style={styles.formActions}>
                <button onClick={handleSave} style={styles.saveBtn}>
                  💾 Lưu thay đổi
                </button>
                <button onClick={handleCancel} style={styles.cancelBtn}>
                  ❌ Hủy
                </button>
              </div>
            </div>
          ) : isChangingPassword ? (
            <div style={styles.editForm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Mật khẩu hiện tại *</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Nhập mật khẩu hiện tại"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Mật khẩu mới *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Xác nhận mật khẩu mới *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Nhập lại mật khẩu mới"
                  style={styles.input}
                />
              </div>

              <div style={styles.formActions}>
                <button onClick={handleChangePassword} style={styles.saveBtn}>
                  🔒 Đổi mật khẩu
                </button>
                <button onClick={handleCancelPassword} style={styles.cancelBtn}>
                  ❌ Hủy
                </button>
              </div>
            </div>
          ) : (
            <div style={styles.infoDisplay}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>📞 Số điện thoại:</span>
                <span style={styles.infoValue}>
                  {user.phone || 'Chưa cập nhật'}
                </span>
              </div>
              
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>📍 Tỉnh/Thành phố:</span>
                <span style={styles.infoValue}>
                  {user.address || 'Chưa cập nhật'}
                </span>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>📅 Ngày tham gia:</span>
                <span style={styles.infoValue}>
                  {new Date().toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '32px 16px',
  },
  title: {
    textAlign: 'center',
    color: '#1976d2',
    marginBottom: 32,
    fontSize: '2rem',
  },
  message: {
    textAlign: 'center',
    color: '#666',
    fontSize: '1.1rem',
  },
  link: {
    color: '#1976d2',
    textDecoration: 'none',
    fontWeight: 600,
  },
  success: {
    background: '#4caf50',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: 4,
    marginBottom: 16,
    textAlign: 'center',
  },
  error: {
    background: '#e53935',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: 4,
    marginBottom: 16,
    textAlign: 'center',
  },
  profileCard: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #eee',
    gap: 16,
  },
  avatar: {
    fontSize: '3rem',
    background: '#f0f0f0',
    borderRadius: '50%',
    width: 80,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#333',
    marginBottom: 4,
  },
  userUsername: {
    color: '#666',
    fontSize: '1rem',
  },
  actionButtons: {
    display: 'flex',
    gap: 12,
  },
  editBtn: {
    background: '#1976d2',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  passwordBtn: {
    background: '#ff9800',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  profileContent: {
    padding: '24px',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#333',
  },
  input: {
    padding: '10px 12px',
    borderRadius: 4,
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  select: {
    padding: '10px 12px',
    borderRadius: 4,
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  formActions: {
    display: 'flex',
    gap: 12,
    marginTop: 16,
  },
  saveBtn: {
    background: '#4caf50',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  cancelBtn: {
    background: '#666',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  infoDisplay: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  infoLabel: {
    fontWeight: 500,
    color: '#333',
    minWidth: 120,
  },
  infoValue: {
    color: '#666',
  },
};

export default ProfilePage; 