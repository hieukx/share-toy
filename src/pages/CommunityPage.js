import React from 'react';

const groups = [
  {
    id: 1,
    name: 'Hội cha mẹ chia sẻ đồ chơi',
    avatar: '🧸',
    desc: 'Nơi cha mẹ trao đổi, chia sẻ đồ chơi, kinh nghiệm nuôi dạy con.',
    members: 120,
  },
  {
    id: 2,
    name: 'Đồ chơi xe điều khiển',
    avatar: '🚗',
    desc: 'Đam mê xe điều khiển, chia sẻ kinh nghiệm, review sản phẩm.',
    members: 80,
  },
  {
    id: 3,
    name: 'Đồ chơi cho bé 0-3 tuổi',
    avatar: '👶',
    desc: 'Chia sẻ kinh nghiệm chọn đồ chơi an toàn cho bé nhỏ.',
    members: 60,
  },
];

function CommunityPage() {
  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Cộng đồng - Hội nhóm</h2>
      <div style={styles.list}>
        {groups.map(group => (
          <div key={group.id} style={styles.card}>
            <div style={styles.avatar}>{group.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={styles.name}>{group.name}</div>
              <div style={styles.desc}>{group.desc}</div>
              <div style={styles.members}>Thành viên: {group.members}</div>
            </div>
            <button style={styles.btn}>Vào nhóm</button>
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
  card: { display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 20, gap: 20 },
  avatar: { fontSize: 36, marginRight: 16 },
  name: { fontWeight: 600, fontSize: 18, marginBottom: 4 },
  desc: { color: '#555', fontSize: 15, marginBottom: 6 },
  members: { color: '#888', fontSize: 14, marginBottom: 8 },
  btn: { background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 500, cursor: 'pointer' },
};

export default CommunityPage; 