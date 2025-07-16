import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getToys } from '../api/toyApi';
import { getUsers } from '../api/userApi';

function BorrowedToysPage({ user }) {
  const [toys, setToys] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadToysAndUsers = async () => {
      try {
        setLoading(true);
        const [allToys, allUsers] = await Promise.all([
          getToys(),
          getUsers()
        ]);
        // Lọc đồ chơi user đã mượn (giả sử có trường borrowedBy là id user)
        const borrowed = allToys.filter(
          toy => toy.isBorrowed && toy.borrowedBy === user?.id
        );
        setToys(borrowed);
        setUsers(allUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) loadToysAndUsers();
  }, [user]);

  // Helper lấy tên chủ sở hữu
  const getOwnerName = (ownerId) => {
    const owner = users.find(u => String(u.id) === String(ownerId));
    return owner ? (owner.fullname || owner.username) : 'Ẩn danh';
  };

  const handleReturnToy = async (toyId) => {
    if (window.confirm('Bạn chắc chắn muốn trả đồ chơi này?')) {
      try {
        // PATCH toy về trạng thái chưa mượn
        const toyRes = await fetch(`http://localhost:9999/toys/${toyId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isBorrowed: false, borrowedBy: '' })
        });
        if (!toyRes.ok) throw new Error('Không thể trả đồ chơi');

        setToys(prev => prev.filter(toy => toy.id !== toyId));
        alert('Đã trả đồ chơi thành công!');
      } catch (error) {
        alert('Có lỗi xảy ra: ' + error.message);
      }
    }
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Đồ chơi đã mượn</h2>
        <div style={styles.message}>
          Vui lòng <Link to="/login" style={styles.link}>đăng nhập</Link> để xem đồ chơi đã mượn.
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Đồ chơi đã mượn</h2>
      {loading ? (
        <div style={styles.message}>Đang tải...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : toys.length === 0 ? (
        <div style={styles.message}>
          Bạn chưa mượn đồ chơi nào.
          <br />
          <Link to="/" style={styles.link}>Quay về trang chủ</Link> để mượn đồ chơi!
        </div>
      ) : (
        <div style={styles.toysGrid}>
          {toys.map(toy => (
            <div key={toy.id} style={styles.toyCard}>
              <img src={toy.image} alt={toy.name} style={styles.toyImage} />
              <div style={styles.toyInfo}>
                <h3 style={styles.toyName}>{toy.name}</h3>
                <p style={styles.toyDescription}>{toy.description}</p>
                <p style={styles.toyOwner}>Chủ sở hữu: {getOwnerName(toy.ownerId)}</p>
                <p style={styles.toyContact}>📞 {toy.contact}</p>
                <div style={styles.toyStatus}>
                  <span style={styles.borrowingStatus}>Đang mượn</span>
                </div>
                <div style={styles.toyActions}>
                  <button 
                    onClick={() => handleReturnToy(toy.id)}
                    style={styles.returnBtn}
                  >
                    🔄 Trả đồ chơi
                  </button>
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
    objectFit: 'contain',
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
  toyOwner: {
    color: '#888',
    fontSize: '0.95rem',
    marginBottom: 4,
  },
  toyContact: {
    color: '#1976d2',
    fontSize: '0.9rem',
    marginBottom: 12,
  },
  toyStatus: {
    marginBottom: 16,
  },
  borrowingStatus: {
    color: '#1976d2',
    fontWeight: 500,
    fontSize: '0.9rem',
  },
  toyActions: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 12,
  },
  returnBtn: {
    background: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    padding: '8px 20px',
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
};

export default BorrowedToysPage; 