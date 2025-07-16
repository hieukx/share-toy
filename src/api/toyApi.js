const API_URL = 'http://localhost:9999/toys';

// Lấy danh sách tất cả đồ chơi
export async function getToys() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Không lấy được danh sách đồ chơi!');
  return await res.json();
}

// Xóa đồ chơi
export async function deleteToy(toyId) {
  const res = await fetch(`${API_URL}/${toyId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Không thể xóa đồ chơi!');
  return await res.json();
}

// Trả đồ chơi
export async function returnToy(toyId) {
  const res = await fetch(`${API_URL}/${toyId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isBorrowed: false, borrowedBy: '' })
  });
  if (!res.ok) throw new Error('Không thể trả đồ chơi!');
  return await res.json();
} 