const API_URL = 'http://localhost:9999/requests';

export async function getRequests() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Không lấy được danh sách đơn mượn!');
  return await res.json();
}

export async function createRequest(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Không gửi được đơn mượn!');
  return await res.json();
} 