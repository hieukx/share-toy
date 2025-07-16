import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/common/Header';
import Navbar from './components/common/Narbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import ToyDetailPage from './pages/ToyDetailPage';
import BorrowedToysPage from './pages/BorrowedToysPage';
import SharedToysPage from './pages/SharedToysPage';
import ProfilePage from './pages/ProfilePage';
import GuidePage from './pages/GuidePage';
import CommunityPage from './pages/CommunityPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ToyForm from './components/common/ToyForm';
import RequestsPage from './pages/RequestsPage';

/**
 * AppWrapper - Component chính quản lý state và routing
 * Chức năng: Quản lý đăng nhập/đăng xuất, routing, và state toàn cục
 */
function AppWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Kiểm tra user đã đăng nhập từ localStorage khi load trang
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Xử lý đăng nhập thành công
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/');
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  // Cập nhật thông tin user
  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  // Chuyển đến trang đăng ký
  const handleRegister = () => navigate('/register');

  // Chuyển đến trang đăng nhập
  const handleGotoLogin = () => navigate('/login');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        isLoggedIn={isLoggedIn}
        user={user}
        onLogin={handleGotoLogin}
        onLogout={handleLogout}
        onRegister={handleRegister}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={() => navigate('/')}
      />
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} onLogin={handleGotoLogin} user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
          <Route path="/toys/:id" element={<ToyDetailPage />} />
          <Route path="/borrowed" element={<BorrowedToysPage user={user} />} />
          <Route path="/shared" element={<SharedToysPage user={user} />} />
          <Route path="/requests" element={<RequestsPage user={user} />} />
          <Route path="/profile" element={<ProfilePage user={user} onUpdateProfile={handleUpdateProfile} />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/share" element={isLoggedIn ? <ToyForm user={user} /> : <LoginPage onLogin={handleLogin} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

/**
 * App - Component gốc của ứng dụng
 * Chức năng: Khởi tạo BrowserRouter và render AppWrapper
 */
function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
