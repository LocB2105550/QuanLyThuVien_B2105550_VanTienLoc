<template>
  <div class="publisher-management">
    <div class="header-actions">
      <h1>Quản lý Nhà Xuất Bản</h1>
      <router-link to="/admin/add-publisher" class="btn-add">
        <i class="fas fa-plus"></i> Thêm nhà xuất bản mới
      </router-link>
    </div>

    <div class="search-filter">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm nhà xuất bản... (ID, Tên)"
          @input="filterPublishers"
        />
      </div>
    </div>

    <div class="publisher-table-container">
      <table class="publisher-table">
        <thead>
          <tr>
            <th>Mã nhà xuất bản</th>
            <th>Tên nhà xuất bản</th>
            <th>Địa chỉ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(publisher, index) in filteredPublishers"
            :key="publisher.id"
          >
            <td>{{ publisher._id }}</td>
            <td>{{ publisher.tennxb }}</td>
            <td>{{ publisher.diachi }}</td>
            <td class="actions">
              <button class="btn-edit" @click="editPublisher(publisher)">
                <i class="fas fa-edit"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredPublishers.length === 0">
            <td colspan="4" class="no-data">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import NhaxuatbanService from "@/services/nhaxuatban.service";

const router = useRouter();
const allPublishers = ref([]);

const fetchPublishers = async () => {
  try {
    const data = await NhaxuatbanService.getAll();
    allPublishers.value = data;
    filterPublishers();
  } catch (error) {
    console.error("Lỗi khi gọi API lấy nhà xuất bản:", error);
    alert("Lỗi khi tải dữ liệu nhà xuất bản. Vui lòng thử lại sau.");
  }
};

// State cho tìm kiếm và lọc
const searchQuery = ref("");
const filteredPublishers = ref([]);

// Lọc nhà xuất bản theo tìm kiếm (tên nhà xuất bản, mã nhà xuất bản)
const filterPublishers = () => {
  filteredPublishers.value = allPublishers.value.filter((publisher) => {
    const matchSearch =
      publisher.tennxb
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      publisher._id.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchSearch;
  });
};

// Chuyển đến trang chỉnh sửa nhà xuất bản
const editPublisher = (publisher) => {
  router.push(`/admin/edit-publisher/${publisher._id}`);
};

// Khởi tạo
onMounted(() => {
  fetchPublishers();
});
</script>

<style scoped>
.publisher-management {
  width: 100%;
  padding: 0 10px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-add {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.btn-add i {
  margin-right: 8px;
}

.search-filter {
  display: flex;
  margin-bottom: 20px;
  gap: 15px;
}

.search-box {
  flex-grow: 1;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
}

.search-box input {
  width: 100%;
  padding: 10px 10px 10px 35px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.publisher-table-container {
  overflow-x: auto;
}

.publisher-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.publisher-table th,
.publisher-table td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid black;
  box-sizing: border-box;
}

.publisher-table th {
  background-color: #f5f7fa;
  color: #2c3e50;
  font-weight: 600;
}

.publisher-table tr:hover {
  background-color: #f8f8f8;
}

.actions {
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  text-align: center !important;
}

.btn-edit,
.btn-delete {
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  text-align: center;
}

.btn-edit {
  background-color: #3498db;
  color: white;
  margin-right: 5px;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 5px;
  width: 400px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.close {
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  background-color: #f5f7fa;
  border-top: 1px solid #e0e0e0;
  gap: 10px;
}

.btn-cancel,
.btn-confirm {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  background-color: #ecf0f1;
  color: #2c3e50;
}

.btn-confirm {
  background-color: #e74c3c;
  color: white;
}
</style>
