import React from "react";
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <NavLink to="/" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })} end>Trang chủ</NavLink>
      {/* <NavLink to="/toys" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>Danh sách đồ chơi</NavLink> */}
      <NavLink to="/shared" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>Đồ chơi chia sẻ</NavLink>
      <NavLink to="/borrowed" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>Đồ chơi đã mượn</NavLink>
      <NavLink to="/requests" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>Quản lý đơn mượn</NavLink>
      <NavLink to="/guide" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>Hướng dẫn</NavLink>
      <NavLink to="/community" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>Cộng đồng</NavLink>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#1976d2',
    display: 'flex',
    justifyContent: 'center',
    // gap: 32, // bỏ gap để các mục trải đều
    padding: '0',
    marginBottom: 0,
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    padding: '14px 0',
    fontWeight: 500,
    fontSize: '1.1rem',
    borderBottom: '3px solid transparent',
    transition: 'border 0.2s',
    position: 'relative',
    flex: 1,
    textAlign: 'center',
  },
  active: {
    borderBottom: '3px solid #fff',
    fontWeight: 700,
  },
};

export default Navbar;
