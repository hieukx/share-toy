import React, { useState } from 'react';
import ProvinceSelect from './ProvinceSelect';

function ToyForm({ user, onToyAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    contact: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('https://via.placeholder.com/120');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Update image preview
    if (name === 'image' && value) {
      setImagePreview(value);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên đồ chơi không được để trống';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'URL ảnh không được để trống';
    } else if (
      !formData.image.startsWith('http') &&
      !formData.image.startsWith('data:image/')
    ) {
      newErrors.image = 'URL ảnh phải bắt đầu bằng http hoặc data:image/';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    }
    
    if (!formData.contact.trim()) {
      newErrors.contact = 'Thông tin liên hệ không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const toyData = {
        ...formData,
        ownerId: user.id,
        isBorrowed: false
      };

      const response = await fetch('http://localhost:9999/toys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toyData),
      });

      if (!response.ok) {
        throw new Error('Không thể thêm đồ chơi');
      }

      // Reset form
      setFormData({
        name: '',
        image: '',
        description: '',
        contact: ''
      });
      setImagePreview('https://via.placeholder.com/120');
      
      // Notify parent component
      if (onToyAdded) {
        onToyAdded();
      }
      
      alert('Thêm đồ chơi thành công!');
      
    } catch (error) {
      alert('Có lỗi xảy ra: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="toy-form-wrap">
      <form className="toy-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Chia sẻ đồ chơi của bạn</h2>
        {/* Thông báo lỗi tổng nếu có */}
        {Object.keys(errors).length > 0 && (
          <div className="form-error-global">Vui lòng kiểm tra lại các trường thông tin!</div>
        )}
        <div className="form-group">
          <label className="form-label">Tên đồ chơi</label>
          <input
            className="form-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Tên đồ chơi"
            autoComplete="off"
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">URL ảnh đồ chơi</label>
          <input
            className="form-input"
            type="text"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="URL ảnh đồ chơi"
            autoComplete="off"
          />
          {errors.image && <div className="form-error">{errors.image}</div>}
        </div>
        <div className="form-group image-preview-group">
          <div className="image-preview">
            <img src={formData.image || imagePreview} alt="Preview" />
          </div>
          <div className="image-preview-label">Xem trước ảnh</div>
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả đồ chơi</label>
          <textarea
            className="form-input"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Mô tả đồ chơi (tình trạng, độ tuổi phù hợp, v.v.)"
            rows={3}
          />
          {errors.description && <div className="form-error">{errors.description}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Thông tin liên hệ</label>
          <input
            className="form-input"
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            placeholder="Thông tin liên hệ (Zalo, SĐT, v.v.)"
            autoComplete="off"
          />
          <div className="form-hint">💡 Gợi ý: 0900000001</div>
          {errors.contact && <div className="form-error">{errors.contact}</div>}
        </div>
        <div className="form-group owner-group">
          <div className="form-owner-label">Chủ sở hữu:</div>
          <div className="form-owner-value">{user?.fullname || user?.username}</div>
        </div>
        <button className="btn btn-primary btn-lg form-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang thêm...' : 'Thêm đồ chơi'}
        </button>
      </form>
      <style jsx>{`
        .toy-form-wrap {
          max-width: 420px;
          margin: 32px auto;
          background: var(--white);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          padding: var(--spacing-12) var(--spacing-8);
        }
        .toy-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-6);
        }
        .form-title {
          text-align: center;
          color: var(--secondary-color);
          font-size: var(--font-size-3xl);
          font-weight: 800;
          margin-bottom: var(--spacing-4);
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }
        .form-label {
          font-weight: 600;
          color: var(--gray-800);
          margin-bottom: 2px;
        }
        .form-input {
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-md);
          padding: var(--spacing-3) var(--spacing-4);
          font-size: var(--font-size-base);
          background: var(--gray-50);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .form-input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(229,57,53,0.08);
          outline: none;
        }
        .form-error {
          color: #e53935;
          font-size: var(--font-size-xs);
          margin-top: 2px;
          margin-left: 2px;
          text-align: left;
        }
        .form-error-global {
          color: #e53935;
          background: #fff3f3;
          border: 1px solid #e53935;
          border-radius: var(--radius-md);
          padding: 8px 12px;
          margin-bottom: 8px;
          text-align: center;
          font-weight: 600;
        }
        .image-preview-group {
          align-items: center;
        }
        .image-preview {
          width: 120px;
          height: 120px;
          background: var(--gray-100);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          border: 1px solid var(--gray-200);
          overflow: hidden;
        }
        .image-preview img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .image-preview-label {
          text-align: center;
          color: var(--gray-500);
          font-size: var(--font-size-xs);
          margin-top: var(--spacing-2);
        }
        .form-hint {
          color: #e6b800;
          font-size: var(--font-size-xs);
          margin-top: 2px;
        }
        .owner-group {
          background: var(--gray-100);
          border-radius: var(--radius-md);
          padding: var(--spacing-2) var(--spacing-4);
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          justify-content: flex-start;
          flex-direction: row;
        }
        .form-owner-label {
          color: var(--gray-600);
          font-size: var(--font-size-sm);
          font-weight: 500;
          margin-right: 8px;
        }
        .form-owner-value {
          color: var(--secondary-color);
          font-weight: 700;
          font-size: var(--font-size-base);
        }
        .form-btn {
          margin-top: var(--spacing-4);
        }
      `}</style>
    </div>
  );
}

export default ToyForm; 