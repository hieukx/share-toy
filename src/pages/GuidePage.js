import React from 'react';

function GuidePage() {
  const steps = [
    {
      title: 'Đăng ký tài khoản',
      desc: 'Tạo tài khoản miễn phí để bắt đầu sử dụng hệ thống.'
    },
    {
      title: 'Đăng nhập',
      desc: 'Sử dụng tên tài khoản và mật khẩu để đăng nhập.'
    },
    {
      title: 'Chia sẻ đồ chơi',
      desc: 'Nhấn nút "Bắt đầu chia sẻ" hoặc điền thông tin đồ chơi mới để chia sẻ với cộng đồng.'
    },
    {
      title: 'Tìm kiếm & mượn đồ chơi',
      desc: 'Duyệt danh sách, tìm kiếm đồ chơi phù hợp và nhấn "Mượn ngay".'
    },
    {
      title: 'Trả đồ chơi',
      desc: 'Sau khi sử dụng, nhấn "Trả đồ chơi" để hoàn tất quá trình mượn.'
    },
    {
      title: 'Tham gia cộng đồng',
      desc: 'Chia sẻ kinh nghiệm, hỏi đáp và kết nối với các thành viên khác.'
    },
  ];

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Hướng dẫn sử dụng hệ thống ShareToys</h2>
      <div style={styles.list}>
        {steps.map((step, idx) => (
          <div key={idx} style={styles.card}>
            <div style={styles.stepNum}>{idx + 1}</div>
            <div>
              <div style={styles.stepTitle}>{step.title}</div>
              <div style={styles.stepDesc}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 700, margin: '32px auto', padding: 16 },
  title: { textAlign: 'center', color: '#1976d2', marginBottom: 32 },
  list: { display: 'flex', flexDirection: 'column', gap: 20 },
  card: { display: 'flex', alignItems: 'flex-start', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 20, gap: 20 },
  stepNum: { minWidth: 40, height: 40, background: '#e53935', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, marginRight: 8 },
  stepTitle: { fontWeight: 600, fontSize: 18, marginBottom: 4 },
  stepDesc: { color: '#555', fontSize: 15 },
};

export default GuidePage; 