<template>
  <div class="borrowing-management">
    <div class="header-actions">
      <h1>Quản lý Mượn Sách</h1>
      <router-link to="/admin/add-borrowing" class="btn-add">
        <i class="fas fa-plus"></i> Thêm mượn sách
      </router-link>
    </div>
    
    <div class="search-container">
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm mượn sách..."
            @input="filterBorrowings"
          />
        </div>
        <div class="filter-select">
          <select v-model="statusFilter" @change="filterBorrowings" class="form-control">
            <option value="">Tất cả trạng thái</option>
            <option value="Đang mượn">Đang mượn</option>
            <option value="Đã trả">Đã trả</option>
            <option value="Chờ lấy sách">Chờ lấy sách</option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 60px;">Ảnh</th>
            <th>Tên sách</th>
            <th>Tên độc giả</th>
            <th>Ngày mượn</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(borrowing, index) in filteredBorrowings"
            :key="borrowing._id"
            :class="getStatusClass(borrowing.status)"
          >
            <td>
              <img :src="borrowing.bookImageUrl || 'https://via.placeholder.com/50x70?text=No+Image'" 
                   alt="Book Image" 
                   class="book-image" />
            </td>
            <td class="text-dark">{{ borrowing.tenSach }}</td>
            <td class="text-dark">{{ borrowing.tenDocGia }}</td>
            <td class="text-dark">{{ formatDate(borrowing.ngayMuon) }}</td>
            <td class="text-dark">{{ formatDate(borrowing.ngayTra) }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(borrowing.status)">
                {{ borrowing.status }}
              </span>
            </td>
            <td class="actions">
              <div class="status-update">
                <select
                  v-model="borrowing.status"
                  @change="updateStatus(borrowing)"
                  class="form-control status-select"
                >
                  <option value="Đang mượn">Đang mượn</option>
                  <option value="Đã trả">Đã trả</option>
                  <option value="Chờ lấy sách">Chờ lấy sách</option>
                </select>
              </div>
            </td>
          </tr>
          <tr v-if="filteredBorrowings.length === 0">
            <td colspan="7" class="no-data">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MuonService from "@/services/muon.service";
import DocgiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";

const borrowings = ref([]);
const searchQuery = ref("");
const statusFilter = ref("");
const filteredBorrowings = ref([]);
const isLoading = ref(false);

const getStatusClass = (status) => {
  switch(status) {
    case 'Đang mượn': return 'status-borrowing';
    case 'Đã trả': return 'status-returned';
    case 'Chờ lấy sách': return 'status-waiting';
    default: return '';
  }
};

const fetchBorrowings = async () => {
  isLoading.value = true;
  try {
    const allBorrowings = await MuonService.getAll();
    
    // Lấy thông tin chi tiết cho mỗi mượn sách
    const enhancedBorrowings = await Promise.all(
      allBorrowings.map(async (borrowing) => {
        try {
          const book = await SachService.get(borrowing.maSach);
          const reader = await DocgiaService.get(borrowing.maDocGia);
          
          return {
            ...borrowing,
            tenSach: book?.tensach || 'Không xác định',
            tenDocGia: reader ? `${reader.hoLot} ${reader.ten}` : 'Không xác định',
            bookImageUrl: book?.imageUrl || null
          };
        } catch (error) {
          console.error(`Lỗi khi lấy thông tin chi tiết cho mượn sách ID: ${borrowing._id}`, error);
          return {
            ...borrowing,
            tenSach: 'Không xác định',
            tenDocGia: 'Không xác định',
            bookImageUrl: null
          };
        }
      })
    );
    
    borrowings.value = enhancedBorrowings;
    filterBorrowings();
    
    console.log("Dữ liệu mượn sách đã được tải:", enhancedBorrowings);
  } catch (error) {
    console.error("Lỗi khi gọi API lấy lịch sử mượn sách:", error);
  } finally {
    isLoading.value = false;
  }
};

const filterBorrowings = () => {
  filteredBorrowings.value = borrowings.value.filter((borrowing) => {
    const matchSearch =
      (borrowing.tenSach?.toLowerCase() || '').includes(searchQuery.value.toLowerCase()) ||
      (borrowing.tenDocGia?.toLowerCase() || '').includes(searchQuery.value.toLowerCase()) ||
      (borrowing.maSach?.toLowerCase() || '').includes(searchQuery.value.toLowerCase()) ||
      (borrowing.maDocGia?.toLowerCase() || '').includes(searchQuery.value.toLowerCase());

    const matchStatus = statusFilter.value
      ? borrowing.status === statusFilter.value
      : true;

    return matchSearch && matchStatus;
  });
};

const updateStatus = async (borrowing) => {
  try {
    const response = await MuonService.update(borrowing._id, {
      status: borrowing.status,
      maDocGia: borrowing.maDocGia,
      maSach: borrowing.maSach,
    });

    console.log("Cập nhật trạng thái thành công:", response);
    if (borrowing.status === "Đã trả") {
      try {
        const book = await SachService.get(borrowing.maSach);
        await SachService.update(borrowing.maSach, { soquyen: book.soquyen + 1 });
      } catch (error) {
        console.error("Lỗi khi cập nhật số quyển sách:", error);
      }
    }
    alert("Cập nhật trạng thái thành công!");
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    alert("Lỗi khi cập nhật trạng thái. Vui lòng thử lại sau.");
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Chưa trả";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

onMounted(async () => {
  await fetchBorrowings();
});
</script>

<style scoped>
/* Thiết lập chiều cao cố định cho các ô trong bảng */
table tr td {
  height: 90px; 
  vertical-align: middle; 
}


.book-image {
  width: 40px;
  height: 56px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: block;
  margin: 0 auto; 
}

.status-badge {
  padding: 0.4rem 0.85rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-block;
  min-width: 110px;
  text-align: center;
}

/* CSS cho ô select */
.status-select {
  width: 140px;
  padding: 0.55rem 0.75rem;
  border-radius: var(--border-radius);
  border: 1px solid #e0e0e0;
  background-color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23333' d='M0 2l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 8px 8px;
  padding-right: 25px;
}

/* Thêm style cho các hàng trong bảng */
table tbody tr {
  border-bottom: 0px solid #f0f0f0;
  transition: background-color 0.2s;
}

table tbody tr:hover {
  background-color: rgba(67, 97, 238, 0.03);
}

table tbody tr:last-child {
  border-bottom: none;
}

.status-select {
  width: 130px;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-borrowing {
  background-color: var(--info-color);
  color: white;
}

.status-returned {
  background-color: var(--success-color);
  color: white;
}

.status-waiting {
  background-color: var(--warning-color);
  color: white;
}

tr.status-borrowing {
  background-color: rgba(72, 149, 239, 0.05);
}

tr.status-returned {
  background-color: rgba(76, 201, 240, 0.05);
}

tr.status-waiting {
  background-color: rgba(248, 150, 30, 0.05);
}

.text-dark {
  color: #212529 !important;
  font-weight: normal;
}

.actions {
  width: 90px;
  text-align: center;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--gray-color);
  font-style: italic;
}


</style>
