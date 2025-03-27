<template>
  <div class="container mt-4">
    <h2>Thêm Nhân Viên</h2>
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

      <button type="submit" class="btn-add">Thêm nhân viên</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import EmployeeService from "@/services/nhanvien.service";

const router = useRouter();

const employee = ref({
  hotennv: "",
  password: "",
  chucvu: "",
  diachi: "",
  sodienthoai: "",
});

const submitForm = async () => {
  try {
    await EmployeeService.create(employee.value);
    alert("Thêm nhân viên thành công!");
    router.push("/admin/employees");
  } catch (error) {
    console.error("Lỗi khi tạo nhân viên:", error);
  }
};
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
