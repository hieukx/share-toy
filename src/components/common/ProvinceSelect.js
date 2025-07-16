import React from 'react';

// Danh sách các tỉnh thành Việt Nam
const PROVINCES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Hải Phòng',
  'Đà Nẵng',
  'Cần Thơ',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái'
];

function ProvinceSelect({ value, onChange, required = false, label = 'Tỉnh/Thành phố', name = 'address', style = {}, selectStyle = {} }) {
  return (
    <div style={{ width: '100%', ...style }}>
      <label style={{ fontSize: '0.9rem', fontWeight: 500, color: '#333', marginBottom: 4, display: 'block' }}>
        {label}{required && ' *'}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 4,
          border: '1px solid #ccc',
          fontSize: '1rem',
          backgroundColor: '#fff',
          cursor: 'pointer',
          ...selectStyle
        }}
      >
        <option value="">Chọn tỉnh/thành phố</option>
        {PROVINCES.map(province => (
          <option key={province} value={province}>{province}</option>
        ))}
      </select>
    </div>
  );
}

export default ProvinceSelect; 