<template>
  <div class="book-list">
    <h1>Danh sách Sách</h1>
    <div class="search-filter">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm sách... (Tên sách, Tên tác giả)"
          @input="filterBooks"
        />
      </div>
    </div>
    
    <div class="books-grid">
      <div v-for="(book, index) in filteredBooks" :key="book._id" class="book-card">
        <div class="book-image-container">
          <div class="book-image">
            <img 
              :src="book.imageUrl" 
              :alt="book.tensach" 
              @error="handleImageError($event, book)"
            />
          </div>
        </div>
        <div class="book-info">
          <h3 class="book-title">{{ book.tensach }}</h3>
          <p class="book-author">
            <i class="fas fa-user-edit"></i> {{ book.tacgia }}
          </p>
          <p class="book-publisher">
            <i class="fas fa-building"></i> {{ book.manxb }}
          </p>
          <div class="book-details">
            <span class="book-year">
              <i class="fas fa-calendar-alt"></i> {{ book.namxuatban }}
            </span>
            <span class="book-price">
              <i class="fas fa-tag"></i> {{ formatPrice(book.dongia) }}
            </span>
          </div>
          <div class="book-status">
            <span :class="book.soquyen > 0 ? 'available' : 'unavailable'">
              {{ book.soquyen > 0 ? 'Có sẵn' : 'Hết sách' }}
            </span>
            <span class="quantity">({{ book.soquyen }} quyển)</span>
          </div>
          <button 
            class="btn-borrow" 
            @click="borrowBook(book)"
            :disabled="book.soquyen === 0"
          >
            <i class="fas fa-book-reader"></i> Đăng ký mượn
          </button>
        </div>
      </div>
      
      <div v-if="filteredBooks.length === 0" class="no-books">
        <i class="fas fa-search"></i>
        <p>Không tìm thấy sách nào.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SachService from "@/services/sach.service";
import MuonService from "@/services/muon.service";

const books = ref([]);
const searchQuery = ref("");
const filteredBooks = ref([]);

const fetchBooks = async () => {
  try {
    const data = await SachService.getAll();
    books.value = data.filter((book) => !book.deleted);
    filterBooks();
  } catch (error) {
    console.error("Lỗi khi gọi API lấy sách:", error);
  }
};

const filterBooks = () => {
  filteredBooks.value = books.value.filter((book) => {
    const matchSearch =
      book.tensach.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.tacgia.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchSearch;
  });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(price);
};

const borrowBook = async (book) => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Vui lòng đăng nhập để mượn sách.");
      return;
    }

    if (book.soquyen === 0) {
      alert("Sách này đã hết!");
      return;
    }

    const borrowData = {
      maDocGia: userId,
      maSach: book._id,
      ngayTra: null,
      status: "Chờ lấy sách",
    };

    await MuonService.create(borrowData);
    alert(`Đăng ký mượn sách: ${book.tensach} thành công!`);
    fetchBooks();
  } catch (error) {
    console.error("Lỗi khi mượn sách:", error);
    alert("Đăng ký mượn sách thất bại!");
  }
};

// Thêm hàm xử lý lỗi hình ảnh
const handleImageError = (event, book) => {
  event.target.src = 'https://via.placeholder.com/180x250?text=Không+có+ảnh';
  event.target.classList.add('fallback-image');
};

onMounted(() => {
  fetchBooks();
});
</script>

<style scoped>
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.book-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: var(--transition);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.book-image-container {
  height: 250px;
  padding: 15px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-image {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.book-image img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.book-image img.fallback-image {
  box-shadow: none;
  opacity: 0.8;
}

.book-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #f0f0f0;
}

.book-title {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: var(--dark-color);
}

.book-author, .book-publisher {
  margin: 0.2rem 0;
  color: var(--gray-color);
  font-size: 0.9rem;
}

.book-details {
  display: flex;
  justify-content: space-between;
  margin: 0.8rem 0;
  font-size: 0.9rem;
}

.book-status {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.available {
  color: #4cc9f0;
  font-weight: 600;
}

.unavailable {
  color: #f72585;
  font-weight: 600;
}

.quantity {
  color: var(--gray-color);
}

.btn-borrow {
  margin-top: auto;
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.6rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-borrow:hover {
  background-color: var(--secondary-color);
}

.btn-borrow:disabled {
  background-color: var(--gray-color);
  cursor: not-allowed;
}

.no-books {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: var(--gray-color);
}

.no-books i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .book-image-container {
    height: 200px;
  }
  
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}
</style>
