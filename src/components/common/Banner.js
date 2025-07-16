import React from "react";
import { useNavigate } from 'react-router-dom';

function Banner({ isLoggedIn }) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (isLoggedIn) navigate('/share');
    else navigate('/login');
  };
  
  return (
    <div className="banner">
      <div className="banner-content">
        <h1 className="banner-title">Chia sẻ đồ chơi - Kết nối yêu thương</h1>
        <p className="banner-desc">
          Đồ chơi cũ, niềm vui mới cho bạn bè. Hãy cùng nhau lan tỏa niềm vui qua từng món đồ chơi!
        </p>
        <button className="banner-button" onClick={handleClick}>
          <span className="button-icon">🎮</span>
          Bắt đầu chia sẻ
        </button>
      </div>
      
      <style jsx>{`
        .banner {
          background: linear-gradient(135deg, 
            rgba(255, 179, 0, 0.1) 0%, 
            rgba(255, 253, 231, 0.3) 50%,
            rgba(229, 57, 53, 0.05) 100%
          );
          background-image: 
            linear-gradient(135deg, 
              rgba(255, 179, 0, 0.1) 0%, 
              rgba(255, 253, 231, 0.3) 50%,
              rgba(229, 57, 53, 0.05) 100%
            ),
            url('https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          padding: var(--spacing-20) 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(2px);
          z-index: 1;
        }

        .banner-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 var(--spacing-6);
        }

        .banner-title {
          font-size: var(--font-size-4xl);
          font-weight: 900;
          color: var(--primary-color);
          margin-bottom: var(--spacing-6);
          text-shadow: 2px 2px 8px rgba(0,0,0,0.45), 0 2px 16px rgba(0,0,0,0.25);
          line-height: 1.2;
        }

        .banner-desc {
          font-size: var(--font-size-xl);
          color: #fff;
          margin-bottom: var(--spacing-8);
          line-height: 1.6;
          text-shadow: 1px 1px 8px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.25);
        }

        .banner-button {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-3);
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          color: var(--white);
          border: none;
          border-radius: var(--radius-xl);
          padding: var(--spacing-4) var(--spacing-8);
          font-size: var(--font-size-lg);
          font-weight: 600;
          cursor: pointer;
          box-shadow: var(--shadow-lg);
          transition: all var(--transition-normal);
          text-decoration: none;
        }

        .banner-button:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-xl);
          background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%);
        }

        .banner-button:active {
          transform: translateY(0);
        }

        .button-icon {
          font-size: var(--font-size-xl);
        }
      `}</style>
    </div>
  );
}

export default Banner; 