import React from 'react';
import ToyCard from './ToyCard';
import BorrowRequestModal from '../common/BorrowRequestModal';
import { deleteToy, returnToy } from '../../api/toyApi';

/**
 * ToyList - Component quản lý danh sách đồ chơi
 * Chức năng: Hiển thị danh sách đồ chơi và xử lý các thao tác mượn/trả/xóa
 */
function ToyList({ toys, user, isLoggedIn, onRequestBorrow, onReturnToy, users }) {
  const [selectedToy, setSelectedToy] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  
  if (!toys || toys.length === 0) return null;

  // Mở modal mượn đồ chơi
  const handleOpenBorrowModal = (toy) => {
    setSelectedToy(toy);
    setModalOpen(true);
  };

  // Đóng modal mượn đồ chơi
  const handleCloseBorrowModal = () => {
    setModalOpen(false);
    setSelectedToy(null);
  };

  // Xử lý khi submit form mượn đồ chơi
  const handleSubmitBorrow = (data) => {
    setModalOpen(false);
    if (onRequestBorrow && selectedToy) {
      onRequestBorrow({ ...data, toy: selectedToy });
    }
    setSelectedToy(null);
  };

  // Xử lý xóa đồ chơi
  const handleDeleteToy = async (toyId) => {
    if (!user) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa đồ chơi này?')) return;

    try {
      await deleteToy(toyId);
      alert('Xóa đồ chơi thành công!');
      if (onRequestBorrow) onRequestBorrow(toyId);
    } catch (error) {
      alert('Có lỗi xảy ra: ' + error.message);
    }
  };

  // Xử lý trả đồ chơi
  const handleReturnToy = async (toyId) => {
    if (!user) return;
    if (!window.confirm('Bạn chắc chắn muốn trả đồ chơi này?')) return;
    
    try {
      await returnToy(toyId);
      alert('Đã trả đồ chơi thành công!');
      if (onReturnToy) onReturnToy();
    } catch (error) {
      alert('Có lỗi xảy ra: ' + error.message);
    }
  };

  // Thêm tên chủ sở hữu cho từng đồ chơi
  const toysWithFullname = users
    ? toys.map(toy => {
        const owner = users.find(u => String(u.id) === String(toy.ownerId));
        return { ...toy, fullname: owner ? owner.fullname : undefined };
      })
    : toys;

  return (
    <div className="toy-list">
      {toysWithFullname.map(toy => (
        <ToyCard
          key={toy.id}
          toy={{
            ...toy,
            isMine: user && toy.ownerId && String(toy.ownerId) === String(user.id)
          }}
          isLoggedIn={isLoggedIn}
          user={user}
          onOpenBorrowModal={() => handleOpenBorrowModal(toy)}
          onDeleteToy={() => handleDeleteToy(toy.id)}
          onReturnToy={
            toy.isBorrowed && String(toy.borrowedBy) === String(user?.id)
              ? () => handleReturnToy(toy.id)
              : undefined
          }
        />
      ))}
      
      <BorrowRequestModal
        open={modalOpen}
        onClose={handleCloseBorrowModal}
        onSubmit={handleSubmitBorrow}
        user={user}
        toy={selectedToy}
      />

      <style jsx>{`
        .toy-list {
          display: contents;
        }
      `}</style>
    </div>
  );
}

export default ToyList; 