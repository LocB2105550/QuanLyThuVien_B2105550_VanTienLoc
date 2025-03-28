<template>
  <div class="employee-management">
    <div class="header-actions">
      <h1>Quản lý Nhân Viên</h1>
      <router-link to="/admin/add-employee" class="btn-add">
        <i class="fas fa-plus"></i> Thêm nhân viên mới
      </router-link>
    </div>

    <div class="search-container">
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
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Họ tên nhân viên</th>
            <th>Chức vụ</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, index) in filteredEmployees" :key="employee._id">
            <td>{{ employee.hotennv }}</td>
            <td>{{ employee.chucvu }}</td>
            <td>{{ employee.diachi }}</td>
            <td>{{ employee.sodienthoai }}</td>
            <td class="actions">
              <button class="btn btn-edit" @click="editEmployee(employee)" title="Sửa">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-delete" @click="deleteEmployee(employee)" title="Xóa">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredEmployees.length === 0">
            <td colspan="5" class="no-data">Không có dữ liệu</td>
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

const filterEmployees = () => {
  filteredEmployees.value = allEmployees.value.filter((employee) => {
    const matchSearch =
      employee.hotennv.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee.chucvu.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee.sodienthoai.includes(searchQuery.value);

    return matchSearch;
  });
};

const editEmployee = (employee) => {
  router.push(`/admin/edit-employee/${employee._id}`);
};

const deleteEmployee = async (employee) => {
  if (confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
    try {
      await EmployeeService.delete(employee._id);
      allEmployees.value = allEmployees.value.filter((e) => e._id !== employee._id);
      filterEmployees();
      alert("Xóa nhân viên thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa nhân viên:", error);
      alert("Xóa nhân viên thất bại!");
    }
  }
};

const fetchEmployees = async () => {
  try {
    const data = await EmployeeService.getAll();
    allEmployees.value = data.filter((employee) => !employee.deleted);
    filterEmployees();
  } catch (error) {
    console.error("Lỗi khi gọi API lấy nhân viên:", error);
  }
};

onMounted(() => {
  fetchEmployees();
});
</script>

<style scoped>
.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background-color: var(--info-color);
  color: white;
}

.btn-delete {
  background-color: var(--danger-color);
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--gray-color);
  font-style: italic;
}
</style>
