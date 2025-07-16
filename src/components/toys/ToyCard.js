import React, { useState } from 'react';
import BorrowRequestModal from '../common/BorrowRequestModal';

/**
 * ToyCard chỉ là UI component, không xử lý logic nghiệp vụ.
 * Nhận callback từ cha (ToyList) qua props.
 */
function ToyCard({ toy, isLoggedIn, user, onOpenBorrowModal, onReturnToy, onDeleteToy }) {
  return (
    <div className="toy-card">
      <div className="card-image-container">
        <img src={toy.image} alt={toy.name} className="card-image" />
        <div className="card-overlay">
          <div className="card-status">
            {toy.isBorrowed ? (
              <span className="status-borrowed">🔒 Đang được mượn</span>
            ) : (
              <span className="status-available">✅ Có sẵn</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{toy.name}</h3>
        {toy.fullname && (
          <div className="card-owner">
            <span className="owner-icon">👤</span>
            <span>Chủ sở hữu: {toy.fullname}</span>
          </div>
        )}
        {/* Mô tả */}
        <div className="card-description-wrap">
          <span className="card-description-title">Mô tả:</span>
          <p className="card-description">{toy.description}</p>
        </div>
        
        {toy.contact && (
          <div className="card-contact">
            <span className="contact-icon">📞</span>
            <span>Liên hệ: {toy.contact}</span>
          </div>
        )}
        
        <div className="card-actions">
          {/* Chưa đăng nhập */}
          {!isLoggedIn && (
            <div className="login-prompt">
              <span className="prompt-icon">🔐</span>
              <span>Đăng nhập để mượn đồ chơi</span>
            </div>
          )}
          
          {/* Đã đăng nhập, không phải chủ sở hữu */}
          {isLoggedIn && !toy.isMine && (
            <>
              {!toy.isBorrowed && (
                <button className="btn btn-primary" onClick={onOpenBorrowModal}>
                  <span className="btn-icon">🎮</span>
                  Mượn ngay
                </button>
              )}
              {toy.isBorrowed && toy.borrowedBy === user?.id && (
                <button className="btn btn-secondary" onClick={onReturnToy}>
                  <span className="btn-icon">↩️</span>
                  Trả đồ chơi
                </button>
              )}
              {toy.isBorrowed && toy.borrowedBy !== user?.id && (
                <div className="status-message">
                  <span className="status-icon">⏳</span>
                  <span>Đang được mượn</span>
                </div>
              )}
            </>
          )}
          
          {/* Đã đăng nhập, là chủ sở hữu */}
          {isLoggedIn && toy.isMine && (
            <>
              {!toy.isBorrowed && (
                <button className="btn btn-outline" onClick={onDeleteToy}>
                  <span className="btn-icon">🗑️</span>
                  Xóa
                </button>
              )}
              {toy.isBorrowed && (
                <div className="status-message">
                  <span className="status-icon">📤</span>
                  <span>Đang cho mượn</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .toy-card {
          background: var(--white);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          transition: all var(--transition-normal);
          border: 1px solid var(--gray-200);
          height: 100%;
          min-height: 420px;
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .toy-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          border-color: var(--primary-color);
        }

        .card-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-normal);
        }

        .toy-card:hover .card-image {
          transform: scale(1.05);
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.1) 0%,
            transparent 50%,
            rgba(0, 0, 0, 0.2) 100%
          );
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          padding: var(--spacing-3);
        }

        .card-status {
          background: rgba(255, 255, 255, 0.9);
          padding: var(--spacing-2) var(--spacing-3);
          border-radius: var(--radius-lg);
          font-size: var(--font-size-xs);
          font-weight: 500;
          backdrop-filter: blur(10px);
        }

        .status-available {
          color: var(--success);
        }

        .status-borrowed {
          color: var(--warning);
        }

        .card-content {
          padding: var(--spacing-6);
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .card-title {
          font-size: var(--font-size-lg);
          font-weight: 700;
          color: var(--gray-900);
          margin: 0 0 var(--spacing-3) 0;
          line-height: 1.3;
        }

        .card-owner {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          font-size: var(--font-size-sm);
          color: var(--gray-600);
          margin-bottom: var(--spacing-3);
        }

        .owner-icon {
          font-size: var(--font-size-base);
        }

        .card-description-wrap {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin: 0 0 var(--spacing-4) 0;
        }
        .card-description-title {
          font-weight: 600;
          color: var(--gray-800);
          min-width: 56px;
        }
        .card-description {
          font-size: var(--font-size-sm);
          color: var(--gray-700);
          line-height: 1.5;
          margin: 0;
          flex: 1;
        }

        .card-contact {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          font-size: var(--font-size-sm);
          color: var(--secondary-color);
          margin-bottom: var(--spacing-4);
          font-weight: 500;
        }

        .contact-icon {
          font-size: var(--font-size-base);
        }

        .card-actions {
          margin-top: auto;
          display: flex;
          justify-content: center;
        }

        .login-prompt {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          color: var(--gray-500);
          font-size: var(--font-size-sm);
          font-style: italic;
          padding: var(--spacing-3);
          background: var(--gray-50);
          border-radius: var(--radius-md);
          border: 1px dashed var(--gray-300);
        }

        .prompt-icon {
          font-size: var(--font-size-base);
        }

        .status-message {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          color: #bfa100;
          font-size: var(--font-size-sm);
          font-weight: 600;
          padding: 8px 14px;
          background: #fffbe6;
          border: 1.5px solid #ffe066;
          border-radius: var(--radius-md);
          box-shadow: none;
        }
        .status-icon {
          font-size: var(--font-size-base);
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
          min-width: 120px;
          justify-content: center;
        }

        .btn:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-lg);
        }

        .btn:active {
          transform: translateY(0);
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          color: var(--white);
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-color) 100%);
        }

        .btn-secondary {
          background: linear-gradient(135deg, var(--secondary-color) 0%, var(--secondary-dark) 100%);
          color: var(--white);
        }

        .btn-secondary:hover {
          background: linear-gradient(135deg, var(--secondary-dark) 0%, var(--secondary-color) 100%);
        }

        .btn-outline {
          background: #f5f5f5;
          color: var(--error);
          border: 1.5px solid var(--error);
          font-size: var(--font-size-sm);
          padding: 8px 14px;
          border-radius: var(--radius-md);
          min-width: unset;
        }
        .btn-outline:hover {
          background: var(--error);
          color: var(--white);
        }
        .btn-icon {
          font-size: var(--font-size-base);
        }
      `}</style>
    </div>
  );
}

export default ToyCard; 