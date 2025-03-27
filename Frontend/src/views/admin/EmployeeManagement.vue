<template>
  <div class="employee-management">
    <div class="header-actions">
      <h1>Quản lý Nhân Viên</h1>
      <router-link to="/admin/add-employee" class="btn-add">
        <i class="fas fa-plus"></i> Thêm nhân viên mới
      </router-link>
    </div>

    <div class="search-filter">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm nhân viên..."
          @input="filterEmployees"
        />
      </div>
    </div>

    <div class="employee-table-container">
      <table class="employee-table">
        <thead>
          <tr>
            <th>Mã nhân viên</th>
            <th>Họ và tên</th>
            <th>Chức vụ</th>
            <th>Địa chỉ</th>
            <th>Điện thoại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(employee, index) in filteredEmployees"
            :key="employee._id"
          >
            <td>{{ employee._id }}</td>
            <td>{{ employee.hotennv }}</td>
            <td>{{ employee.chucvu }}</td>
            <td>{{ employee.diachi }}</td>
            <td>{{ employee.sodienthoai }}</td>
            <td class="actions">
              <button class="btn-edit" @click="editEmployee(employee)">
                <i class="fas fa-edit"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredEmployees.length === 0">
            <td colspan="6" class="no-data">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import EmployeeService from "@/services/nhanvien.service";

const router = useRouter();
const allEmployees = ref([]);
const searchQuery = ref("");
const filteredEmployees = ref([]);

// Lọc nhân viên theo tìm kiếm (họ tên, chức vụ, mã nhân viên)
const filterEmployees = () => {
  filteredEmployees.value = allEmployees.value.filter((employee) => {
    const matchSearch =
      employee.hotennv
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      employee.chucvu.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee._id.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchSearch;
  });
};

// Chuyển đến trang chỉnh sửa nhân viên
const editEmployee = (employee) => {
  router.push(`/admin/edit-employee/${employee._id}`);
};

// Lấy danh sách nhân viên từ back end khi component mounted
const fetchEmployees = async () => {
  try {
    const data = await EmployeeService.getAll();
    allEmployees.value = data.filter((employee) => !employee.deleted);
    filterEmployees();
  } catch (error) {
    console.error("Lỗi khi gọi API lấy nhân viên:", error);
  }
};

// Khởi tạo
onMounted(() => {
  fetchEmployees();
});
</script>

<style scoped>
.employee-management {
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

.employee-table-container {
  overflow-x: auto;
}

.employee-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.employee-table th,
.employee-table td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid black;
  box-sizing: border-box;
}

.employee-table th {
  background-color: #f5f7fa;
  color: #2c3e50;
  font-weight: 600;
}

.employee-table tr:hover {
  background-color: #f8f8f8;
}

.actions {
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  text-align: center !important;
}

.btn-edit {
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  text-align: center;
  background-color: #3498db;
  color: white;
  margin-right: 5px;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
}
</style>
