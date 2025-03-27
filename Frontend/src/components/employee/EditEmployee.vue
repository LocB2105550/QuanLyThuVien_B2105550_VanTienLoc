<template>
  <div class="container mt-4">
    <h2>Chỉnh Sửa Nhân Viên</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label class="form-label">Họ tên nhân viên</label>
        <input
          v-model="employee.hotennv"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Mật khẩu</label>
        <input
          v-model="employee.password"
          type="password"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Chức vụ</label>
        <input
          v-model="employee.chucvu"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Địa chỉ</label>
        <input
          v-model="employee.diachi"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Số điện thoại</label>
        <input
          v-model="employee.sodienthoai"
          type="text"
          class="form-control"
          required
        />
      </div>

      <button type="submit" class="btn-add" v-if="!isUpdating">
        Cập nhật nhân viên
      </button>
      <button type="button" class="btn-add" disabled v-else>
        <i class="fas fa-spinner fa-spin"></i> Đang cập nhật...
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import EmployeeService from "@/services/nhanvien.service";

const router = useRouter();
const route = useRoute();

const employee = ref({
  hotennv: "",
  password: "",
  chucvu: "",
  diachi: "",
  sodienthoai: "",
});

const isUpdating = ref(false);

const submitForm = async () => {
  isUpdating.value = true;
  try {
    await EmployeeService.update(route.params.id, employee.value);
    alert("Cập nhật nhân viên thành công!");
    router.push("/admin/employees");
  } catch (error) {
    console.error("Lỗi khi cập nhật nhân viên:", error);
  } finally {
    isUpdating.value = false;
  }
};

// Fetch employee data if not passed via route state
onMounted(async () => {
  if (!route.state?.employee) {
    try {
      const data = await EmployeeService.get(route.params.id);
      employee.value = data;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu nhân viên:", error);
    }
  } else {
    employee.value = route.state.employee;
  }
});
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.btn-add {
  background-color: #3498db;
  color: white;
  padding: 5px 15px;
}
</style>
