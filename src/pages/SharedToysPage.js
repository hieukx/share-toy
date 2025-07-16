import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToys } from '../api/toyApi';
import { getUsers } from '../api/userApi';

function SharedToysPage({ user }) {
  const [toys, setToys] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadToysAndUsers = async () => {
      try {
        setLoading(true);
        const [allToys, allUsers] = await Promise.all([getToys(), getUsers()]);
        // Lọc đồ chơi của user hiện tại
        const userToys = allToys.filter(toy => toy.ownerId === user?.id);
        setToys(userToys);
        setUsers(allUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      loadToysAndUsers();
    }
  }, [user]);

  const handleDeleteToy = async (toyId) => {
    if (window.confirm('Bạn có chắc muốn xóa đồ chơi này?')) {
      try {
        const response = await fetch(`http://localhost:9999/toys/${toyId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setToys(prev => prev.filter(toy => toy.id !== toyId));
          alert('Đã xóa đồ chơi thành công!');
        } else {
          throw new Error('Không thể xóa đồ chơi');
        }
      } catch (error) {
        alert('Có lỗi xảy ra: ' + error.message);
      }
    }
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Đồ chơi đã chia sẻ</h2>
        <div style={styles.message}>
          Vui lòng <Link to="/login" style={styles.link}>đăng nhập</Link> để xem đồ chơi của bạn.
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h2 style={styles.title}>Đồ chơi đã chia sẻ</h2>
        <button className="btn btn-primary" style={{ minWidth: 160 }} onClick={() => navigate('/share')}>
          <span style={{ fontSize: '1.2em', marginRight: 6 }}>➕</span> Chia sẻ đồ chơi
        </button>
      </div>
      {loading ? (
        <div style={styles.message}>Đang tải...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : toys.length === 0 ? (
        <div style={styles.message}>
          Bạn chưa chia sẻ đồ chơi nào. <br />
          <Link to="/" style={styles.link}>Quay về trang chủ</Link> để chia sẻ đồ chơi đầu tiên!
        </div>
      ) : (
        <div style={styles.toysGrid}>
          {toys.map(toy => (
            <div key={toy.id} style={styles.toyCard}>
              <img src={toy.image} alt={toy.name} style={styles.toyImage} />
              <div style={styles.toyInfo}>
                <h3 style={styles.toyName}>{toy.name}</h3>
                <p style={styles.toyDescription}>{toy.description}</p>
                <p style={styles.toyContact}>📞 {toy.contact}</p>
                <div style={styles.toyStatus}>
                  {toy.isBorrowed ? (
                    <span style={styles.borrowedStatus}>
                      🔴 Đang được mượn
                      {(() => {
                        const borrower = users.find(u => String(u.id) === String(toy.borrowedBy));
                        return borrower ? ` bởi: ${borrower.fullname || borrower.username}` : '';
                      })()}
                    </span>
                  ) : (
                    <span style={styles.availableStatus}>🟢 Có sẵn</span>
                  )}
                </div>
                <div style={styles.toyActions}>
                  {/* Chỉ hiển thị nút Xóa nếu chưa bị mượn */}
                  {!toy.isBorrowed ? (
                    <button 
                      onClick={() => handleDeleteToy(toy.id)}
                      style={styles.deleteBtn}
                    >
                      🗑️ Xóa
                    </button>
                  ) : (
                    <span style={styles.borrowedStatus}>Không thể xóa khi đang cho mượn</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1200,
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
    lineHeight: 1.6,
  },
  error: {
    textAlign: 'center',
    color: '#e53935',
    fontSize: '1.1rem',
  },
  link: {
    color: '#1976d2',
    textDecoration: 'none',
    fontWeight: 600,
  },
  toysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 24,
  },
  toyCard: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    transition: 'transform 0.2s',
  },
  toyImage: {
    width: '100%',
    height: 200,
    objectFit: 'contain', // Sửa lại để ảnh không bị vỡ
    display: 'block',
    margin: '0 auto',
    background: '#f9f9f9',
  },
  toyInfo: {
    padding: 20,
  },
  toyName: {
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#333',
    marginBottom: 8,
  },
  toyDescription: {
    color: '#666',
    fontSize: '0.95rem',
    lineHeight: 1.5,
    marginBottom: 12,
  },
  toyContact: {
    color: '#1976d2',
    fontSize: '0.9rem',
    marginBottom: 12,
  },
  toyStatus: {
    marginBottom: 16,
  },
  borrowedStatus: {
    color: '#e53935',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  availableStatus: {
    color: '#4caf50',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  toyActions: {
    display: 'flex',
    justifyContent: 'center', // căn giữa nút Xóa
    gap: 12,
    marginTop: 12,
  },
  viewBtn: {
    flex: 1,
    background: '#1976d2',
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: 4,
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  deleteBtn: {
    background: '#e53935',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
};

export default SharedToysPage; 