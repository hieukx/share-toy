import React, { useState, useEffect } from 'react';

function BorrowRequestModal({ open, onClose, onSubmit, user, toy }) {
  const [borrowDays, setBorrowDays] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setBorrowDays('');
      setAgreed(false);
      setError('');
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      setError('Bạn cần cam kết thực hiện đầy đủ các yêu cầu!');
      return;
    }
    setError('');
    onSubmit({ borrowDays, agreed });
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Yêu cầu mượn đồ chơi</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-row">
            <label>Họ tên người mượn:</label>
            <span className="modal-value">{user?.fullname || user?.username}</span>
          </div>
          <div className="modal-row">
            <label>Tên trò chơi:</label>
            <span className="modal-value">{toy?.name || ''}</span>
          </div>
          <div className="modal-row">
            <label>Số ngày muốn mượn:</label>
            <input
              type="number"
              value={borrowDays}
              onChange={e => setBorrowDays(e.target.value)}
              min={1}
              max={9999}
              placeholder="Nhập số ngày"
              required
              className="modal-input"
            />
          </div>
          <div className="modal-row modal-agreements">
            <label className="modal-label">Danh sách yêu cầu:</label>
            <ul className="modal-requirements">
              <li>Trả đồ chơi đúng hạn</li>
              <li>Giữ gìn vệ sinh, không làm hỏng</li>
              <li>Liên hệ chủ sở hữu khi có vấn đề</li>
            </ul>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={agreed} 
                onChange={e => setAgreed(e.target.checked)} 
              />
              Tôi cam kết thực hiện đầy đủ các yêu cầu trên
            </label>
          </div>
          {error && <div className="modal-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Đóng</button>
            <button type="submit" className="btn btn-primary">Gửi yêu cầu</button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.18);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.12);
          padding: 32px 28px;
          min-width: 340px;
          max-width: 95vw;
        }
        .modal-row {
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
        }
        .modal-value {
          font-weight: 600;
          color: #1976d2;
          margin-top: 4px;
        }
        .modal-input {
          width: 120px;
        }
        .modal-agreements {
          margin-bottom: 18px;
        }
        .modal-label {
          margin-bottom: 8px;
          font-weight: 600;
        }
        .checkbox-label {
          display: block;
          margin-bottom: 6px;
          font-size: 15px;
          font-weight: 500;
        }
        .modal-requirements {
          margin: 0 0 10px 18px;
          padding: 0;
          color: #444;
          font-size: 15px;
        }
        .modal-requirements li {
          margin-bottom: 4px;
        }
        .modal-error {
          color: #e53935;
          margin-bottom: 12px;
          font-weight: 500;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
      `}</style>
    </div>
  );
}

export default BorrowRequestModal; 