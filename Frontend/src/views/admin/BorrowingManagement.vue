<template>
  <div class="borrowing-management">
    <div class="header-actions">
      <h1>Quản lý Mượn Sách</h1>
      <router-link to="/admin/add-borrowing" class="btn-add">
        <i class="fas fa-plus"></i> Thêm mượn sách
      </router-link>
    </div>
    
    <div class="search-filter">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm theo tên sách, độc giả..."
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

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Mã độc giả</th>
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
            <td>{{ borrowing.maSach }}</td>
            <td>{{ borrowing.tenSach }}</td>
            <td>{{ borrowing.maDocGia }}</td>
            <td>{{ borrowing.tenDocGia }}</td>
            <td>{{ formatDate(borrowing.ngayMuon) }}</td>
            <td>{{ formatDate(borrowing.ngayTra) }}</td>
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
            <td colspan="8" class="no-data">Không có dữ liệu</td>
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

const getStatusClass = (status) => {
  switch(status) {
    case 'Đang mượn': return 'status-borrowing';
    case 'Đã trả': return 'status-returned';
    case 'Chờ lấy sách': return 'status-waiting';
    default: return '';
  }
};

const fetchBorrowings = async () => {
  try {
    const allBorrowings = await MuonService.getAll();
    for (const borrowing of allBorrowings) {
      const book = await SachService.get(borrowing.maSach);
      const reader = await DocgiaService.get(borrowing.maDocGia);
      borrowing.tenSach = book.tensach;
      borrowing.tenDocGia = reader.hoLot + " " + reader.ten;
    }
    borrowings.value = allBorrowings;
    filterBorrowings();
  } catch (error) {
    console.error("Lỗi khi gọi API lấy lịch sử mượn sách:", error);
  }
};

const filterBorrowings = () => {
  filteredBorrowings.value = borrowings.value.filter((borrowing) => {
    const matchSearch =
      borrowing.tenSach
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      borrowing.maSach
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      borrowing.tenDocGia
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      borrowing.maDocGia
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());

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
    if (response.status === "Đã trả") {
      const book = await SachService.get(borrowing.maSach);
      await SachService.update(borrowing.maSach, { soquyen: book.soquyen + 1 });
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

// Khởi tạo
onMounted(async () => {
  await fetchBorrowings();
});
</script>

<style scoped>
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

.actions {
  text-align: center;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--gray-color);
  font-style: italic;
}
</style>
