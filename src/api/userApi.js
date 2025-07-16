const API_URL = 'http://localhost:9999/users';

export async function registerUser({ username, fullname, password, phone, address }) {
  // Kiểm tra trùng username
  const res = await fetch(`${API_URL}?username=${username}`);
  const users = await res.json();
  if (users.length > 0) throw new Error('Tên tài khoản đã tồn tại!');

  // Thêm user mới
  const userData = {
    username,
    fullname,
    password,
    phone: phone || '',
    address: address || ''
  };

  const res2 = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res2.ok) throw new Error('Đăng ký thất bại!');
  return await res2.json();
}

export async function loginUser({ username, password }) {
  const res = await fetch(`${API_URL}?username=${username}&password=${password}`);
  const users = await res.json();
  if (users.length === 0) throw new Error('Sai tài khoản hoặc mật khẩu!');
  return users[0];
}

export async function getUsers() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Không lấy được danh sách người dùng!');
  return await res.json();
} 