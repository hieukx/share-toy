import React, { useEffect, useState } from 'react';
import Banner from '../components/common/Banner';
import ToyList from '../components/toys/ToyList';
import { getToys } from '../api/toyApi';
import { getUsers } from '../api/userApi';
import { createRequest } from '../api/requestApi';

/**
 * Home - Trang chủ hiển thị danh sách đồ chơi
 * Chức năng: Tải dữ liệu, tìm kiếm, và xử lý yêu cầu mượn đồ chơi
 */
function Home({ isLoggedIn, onLogin, user, searchTerm, setSearchTerm }) {
  const [toys, setToys] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Tải danh sách đồ chơi và users từ API
  const loadToysAndUsers = () => {
    setLoading(true);
    Promise.all([getToys(), getUsers()])
      .then(([toysData, usersData]) => {
        setToys(toysData);
        setUsers(usersData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Tải dữ liệu khi component mount
  useEffect(() => {
    loadToysAndUsers();
  }, []);

  // Lọc danh sách đồ chơi theo từ khóa tìm kiếm
  const filteredToys = toys.filter(toy => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return true;
    return (
      (toy.name && toy.name.toLowerCase().includes(keyword)) ||
      (toy.description && toy.description.toLowerCase().includes(keyword))
    );
  });

  // Xử lý yêu cầu mượn đồ chơi
  const handleRequestBorrow = async (requestData) => {
    const { borrowDays, toy } = requestData;
    try {
      await createRequest({
        toyId: toy.id,
        toyName: toy.name,
        ownerId: toy.ownerId,
        requesterId: user.id,
        borrowDays,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      window.alert('Gửi yêu cầu thành công! Vui lòng đợi chủ sở hữu duyệt.');
      loadToysAndUsers();
    } catch (err) {
      window.alert('Gửi yêu cầu thất bại!');
    }
  };

  // Xóa từ khóa tìm kiếm
  const handleClearSearch = () => setSearchTerm('');

  return (
    <div className="home-page">
      <Banner isLoggedIn={isLoggedIn} onLogin={onLogin} />
      
      <section className="toy-list-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">🎮</span>
              Danh sách đồ chơi
            </h2>
            <p className="section-desc">
              Khám phá và mượn những món đồ chơi thú vị từ cộng đồng
            </p>
          </div>

          <div className="toy-list-container">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Đang tải danh sách đồ chơi...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h3 className="error-title">Có lỗi xảy ra</h3>
                <p className="error-message">{error}</p>
                <button className="btn btn-primary" onClick={loadToysAndUsers}>
                  <span className="btn-icon">🔄</span>
                  Thử lại
                </button>
              </div>
            ) : filteredToys.length === 0 ? (
              <div className="empty-container">
                <div className="empty-icon">📦</div>
                <h3 className="empty-title">Không tìm thấy kết quả phù hợp.</h3>
                <p className="empty-desc">
                  Hãy thử từ khóa khác hoặc <span className="clear-search-link" onClick={handleClearSearch}>xóa tìm kiếm</span>.
                </p>
              </div>
            ) : (
              <ToyList
                toys={filteredToys}
                user={user}
                isLoggedIn={isLoggedIn}
                onRequestBorrow={handleRequestBorrow}
                onReturnToy={loadToysAndUsers}
                users={users}
              />
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-page {
          min-height: 100vh;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-6);
        }
        .section-header {
          text-align: center;
          margin-bottom: var(--spacing-8);
        }
        .section-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-3);
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: var(--spacing-4);
        }
        .title-icon {
          font-size: var(--font-size-2xl);
        }
        .section-desc {
          font-size: var(--font-size-lg);
          color: var(--gray-600);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .toy-list-section {
          padding: var(--spacing-16) 0;
          background: var(--white);
        }
        .toy-list-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--spacing-8);
          margin-top: var(--spacing-8);
        }
        .loading-container {
          grid-column: 1 / -1;
          text-align: center;
          padding: var(--spacing-16) 0;
        }
        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid var(--gray-200);
          border-top: 4px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto var(--spacing-4);
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .loading-text {
          font-size: var(--font-size-lg);
          color: var(--gray-600);
          font-weight: 500;
        }
        .error-container {
          grid-column: 1 / -1;
          text-align: center;
          padding: var(--spacing-16) 0;
        }
        .error-icon {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--spacing-4);
          display: block;
        }
        .error-title {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--error);
          margin-bottom: var(--spacing-3);
        }
        .error-message {
          font-size: var(--font-size-base);
          color: var(--gray-600);
          margin-bottom: var(--spacing-6);
        }
        .empty-container {
          grid-column: 1 / -1;
          text-align: center;
          padding: var(--spacing-16) 0;
        }
        .empty-icon {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--spacing-4);
          display: block;
        }
        .empty-title {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--gray-700);
          margin-bottom: var(--spacing-3);
        }
        .empty-desc {
          font-size: var(--font-size-base);
          color: var(--gray-600);
          margin-bottom: var(--spacing-6);
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }
        .clear-search-link {
          color: #1976d2;
          cursor: pointer;
          text-decoration: underline;
        }
        .clear-search-link:hover {
          color: #1565c0;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-2);
          padding: var(--spacing-3) var(--spacing-6);
          border: none;
          border-radius: var(--radius-lg);
          font-size: var(--font-size-sm);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-decoration: none;
        }
        .btn-primary {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          color: var(--white);
        }
        .btn-icon {
          font-size: var(--font-size-base);
        }
      `}</style>
    </div>
  );
}

export default Home; 