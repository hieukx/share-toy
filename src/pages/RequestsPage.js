import React, { useEffect, useState } from 'react';
import { getUsers } from '../api/userApi';

// Giả sử có API getRequests, nếu chưa có sẽ dùng fetch trực tiếp
async function getRequests() {
  const res = await fetch('http://localhost:9999/requests');
  if (!res.ok) throw new Error('Không lấy được danh sách đơn mượn!');
  return await res.json();
}

function RequestsPage({ user }) {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('sent'); // 'sent' hoặc 'received'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reqs, us] = await Promise.all([getRequests(), getUsers()]);
        setRequests(reqs);
        setUsers(us);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!user) {
    return <div style={{ textAlign: 'center', marginTop: 40 }}>Vui lòng đăng nhập để xem quản lý đơn mượn.</div>;
  }

  // Đơn tôi gửi
  const sentRequests = requests.filter(r => r.requesterId === user.id);
  // Đơn người khác gửi cho tôi
  const receivedRequests = requests.filter(r => r.ownerId === user.id);

  // Helper lấy tên user
  const getUserName = (id) => {
    const u = users.find(u => String(u.id) === String(id));
    return u ? u.fullname || u.username : id;
  };

  return (
    <div style={{ maxWidth: 800, margin: '32px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32 }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Quản lý đơn mượn</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
        <button onClick={() => setTab('sent')} style={{ fontWeight: tab==='sent'?700:500, color: tab==='sent'?'#1976d2':'#333', background: 'none', border: 'none', borderBottom: tab==='sent'?'2px solid #1976d2':'2px solid transparent', fontSize: 18, padding: 8, cursor: 'pointer' }}>Đơn mượn gửi</button>
        <button onClick={() => setTab('received')} style={{ fontWeight: tab==='received'?700:500, color: tab==='received'?'#1976d2':'#333', background: 'none', border: 'none', borderBottom: tab==='received'?'2px solid #1976d2':'2px solid transparent', fontSize: 18, padding: 8, cursor: 'pointer' }}>Đơn mượn đến</button>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#888' }}>Đang tải...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: '#e53935' }}>{error}</div>
      ) : (
        <div>
          {tab === 'sent' ? (
            <RequestList requests={sentRequests} users={users} getUserName={getUserName} type="sent" />
          ) : (
            <RequestList requests={receivedRequests} users={users} getUserName={getUserName} type="received" />
          )}
        </div>
      )}
    </div>
  );
}

function RequestList({ requests, users, getUserName, type }) {
  const [processingId, setProcessingId] = React.useState(null);
  const [rejectModal, setRejectModal] = React.useState({ open: false, id: null });
  const [rejectReason, setRejectReason] = React.useState('');

  const handleUpdateStatus = async (id, status, reason) => {
    setProcessingId(id + status);
    try {
      // Cập nhật trạng thái đơn
      await fetch(`http://localhost:9999/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(status === 'rejected' ? { status, rejectReason: reason } : { status })
      });
      if (status === 'accepted') {
        const req = requests.find(r => String(r.id) === String(id));
        if (req) {
          await fetch(`http://localhost:9999/toys/${req.toyId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isBorrowed: true, borrowedBy: req.requesterId })
          });
          // Tự động reject các đơn khác cùng toyId còn pending
          const pendingOthers = requests.filter(
            r => r.toyId === req.toyId && r.status === 'pending' && String(r.id) !== String(id)
          );
          for (const other of pendingOthers) {
            await fetch(`http://localhost:9999/requests/${other.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'rejected', rejectReason: 'Đồ chơi đã có người mượn trước rồi' })
            });
          }
        }
      }
      window.location.reload();
    } catch (err) {
      alert('Có lỗi khi cập nhật trạng thái!');
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (id) => {
    setRejectModal({ open: true, id });
    setRejectReason('');
  };
  const closeRejectModal = () => {
    setRejectModal({ open: false, id: null });
    setRejectReason('');
  };
  const confirmReject = () => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối!');
      return;
    }
    handleUpdateStatus(rejectModal.id, 'rejected', rejectReason);
    closeRejectModal();
  };

  if (!requests.length) return <div style={{ textAlign: 'center', color: '#888', margin: 24 }}>Không có đơn nào.</div>;
  return (
    <>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={th}>Trò chơi</th>
            <th style={th}>{type === 'sent' ? 'Chủ sở hữu' : 'Người mượn'}</th>
            <th style={th}>Số ngày</th>
            <th style={th}>Trạng thái</th>
            {type === 'sent' && <th style={th}>Lý do từ chối</th>}
            {type === 'received' && <th style={th}>Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={td}>{r.toyName || r.toyId}</td>
              <td style={td}>{type === 'sent' ? getUserName(r.ownerId) : getUserName(r.requesterId)}</td>
              <td style={td}>{r.borrowDays}</td>
              <td style={td}>{statusText(r.status)}</td>
              {type === 'sent' && <td style={td}>{r.status === 'rejected' && r.rejectReason ? r.rejectReason : ''}</td>}
              {type === 'received' && (
                <td style={td}>
                  {r.status === 'pending' ? (
                    <>
                      <button
                        style={{ marginRight: 8, padding: '4px 12px', background: '#43a047', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, opacity: processingId === r.id+'accepted' ? 0.6 : 1 }}
                        disabled={processingId === r.id+'accepted'}
                        onClick={() => handleUpdateStatus(r.id, 'accepted')}
                      >
                        Duyệt
                      </button>
                      <button
                        style={{ padding: '4px 12px', background: '#e53935', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, opacity: processingId === r.id+'rejected' ? 0.6 : 1 }}
                        disabled={processingId === r.id+'rejected'}
                        onClick={() => openRejectModal(r.id)}
                      >
                        Từ chối
                      </button>
                    </>
                  ) : null}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal nhập lý do từ chối */}
      {rejectModal.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, maxWidth: '90vw', boxShadow: '0 4px 32px rgba(0,0,0,0.12)' }}>
            <h3 style={{ marginBottom: 16 }}>Nhập lý do từ chối đơn mượn</h3>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={4}
              style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 8, marginBottom: 16 }}
              placeholder="Nhập lý do từ chối..."
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={closeRejectModal} style={{ padding: '6px 18px', borderRadius: 4, border: 'none', background: '#eee', color: '#333', fontWeight: 500 }}>Hủy</button>
              <button onClick={confirmReject} style={{ padding: '6px 18px', borderRadius: 4, border: 'none', background: '#e53935', color: '#fff', fontWeight: 600 }}>Xác nhận từ chối</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const th = { padding: 10, fontWeight: 600, color: '#1976d2', borderBottom: '2px solid #e3e3e3', textAlign: 'left' };
const td = { padding: 10, color: '#333', fontSize: 15 };
function statusText(status) {
  if (status === 'pending') return 'Chờ duyệt';
  if (status === 'accepted') return 'Đã duyệt';
  if (status === 'rejected') return 'Từ chối';
  return status;
}

export default RequestsPage; 