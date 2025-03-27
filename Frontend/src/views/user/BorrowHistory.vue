<template>
  <div class="borrow-history">
    <h1>Lịch Sử Mượn Sách</h1>
    
    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Đang tải dữ liệu...</p>
    </div>
    
    <div v-else-if="borrowings.length === 0" class="no-history">
      <i class="fas fa-book"></i>
      <p>Bạn chưa có lịch sử mượn sách nào.</p>
      <router-link to="/user/books" class="btn-browse">
        Tìm sách để mượn
      </router-link>
    </div>
    
    <div v-else class="history-list">
      <div 
        v-for="(borrow, index) in borrowings" 
        :key="borrow._id"
        class="history-card"
        :class="getStatusClass(borrow.status)"
      >
        <div class="book-image">
          <img 
            :src="borrow.bookImageUrl" 
            :alt="borrow.tenSach" 
            @error="$event.target.src = 'https://via.placeholder.com/100x150?text=Không+có+ảnh'"
          />
        </div>
        <div class="borrow-details">
          <h3>{{ borrow.tenSach }}</h3>
          
          <div class="detail-item">
            <i class="fas fa-calendar-alt"></i>
            <span>Ngày mượn: {{ formatDate(borrow.ngayMuon) }}</span>
          </div>
          
          <div class="detail-item">
            <i class="fas fa-calendar-check"></i>
            <span>Ngày trả: {{ borrow.ngayTra ? formatDate(borrow.ngayTra) : 'Chưa trả' }}</span>
          </div>
          
          <div class="status">
            <span class="status-badge" :class="getStatusClass(borrow.status)">
              {{ borrow.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MuonService from '@/services/muon.service';
import SachService from '@/services/sach.service';
import { useRouter } from 'vue-router';

const borrowings = ref([]);
const isLoading = ref(true);
const router = useRouter();

const getStatusClass = (status) => {
  switch(status) {
    case 'Đang mượn': return 'status-borrowing';
    case 'Đã trả': return 'status-returned';
    case 'Chờ lấy sách': return 'status-waiting';
    default: return '';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Chưa xác định";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

const fetchBorrowHistory = async () => {
  isLoading.value = true;
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/user-login');
      return;
    }
    
    const allBorrowings = await MuonService.getAll();
    const userBorrowings = allBorrowings.filter(b => b.maDocGia === userId);
    
    // Fetch book details for each borrowing
    for (const borrow of userBorrowings) {
      try {
        const book = await SachService.get(borrow.maSach);
        borrow.tenSach = book.tensach;
        borrow.bookImageUrl = book.imageUrl;
      } catch (error) {
        console.error(`Error fetching book ${borrow.maSach}:`, error);
        borrow.tenSach = "Không xác định";
        borrow.bookImageUrl = "";
      }
    }
    
    // Sort borrowings by date (newest first)
    borrowings.value = userBorrowings.sort((a, b) => 
      new Date(b.ngayMuon) - new Date(a.ngayMuon)
    );
  } catch (error) {
    console.error("Error fetching borrow history:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchBorrowHistory();
});
</script>

<style scoped>
.borrow-history {
  padding: 1rem 0;
}

.loading, .no-history {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--gray-color);
}

.loading i, .no-history i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.btn-browse {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: var(--border-radius);
  margin-top: 1rem;
  text-decoration: none;
  transition: var(--transition);
}

.btn-browse:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.history-card {
  display: flex;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: var(--transition);
  border-left: 5px solid #ccc;
}

.history-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.history-card.status-borrowing {
  border-left-color: var(--info-color);
}

.history-card.status-returned {
  border-left-color: var(--success-color);
}

.history-card.status-waiting {
  border-left-color: var(--warning-color);
}

.book-image {
  width: 120px;
  height: 150px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  padding: 10px;
}

.book-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.borrow-details {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.borrow-details h3 {
  margin: 0 0 1rem;
  color: var(--dark-color);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: var(--gray-color);
}

.status {
  margin-top: auto;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.status-borrowing {
  background-color: var(--info-color);
  color: white;
}

.status-badge.status-returned {
  background-color: var(--success-color);
  color: white;
}

.status-badge.status-waiting {
  background-color: var(--warning-color);
  color: white;
}

@media (max-width: 768px) {
  .history-card {
    flex-direction: column;
  }
  
  .book-image {
    width: 100%;
    height: 160px;
    padding: 15px;
  }
}
</style>