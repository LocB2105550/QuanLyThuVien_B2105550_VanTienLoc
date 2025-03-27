<template>
  <div class="container mt-4">
    <h2>Chỉnh Sửa Độc Giả</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label class="form-label">Họ lót</label>
        <input
          v-model="reader.hoLot"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Tên</label>
        <input v-model="reader.ten" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Ngày sinh</label>
        <input
          v-model="reader.ngaySinh"
          type="date"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Phái</label>
        <select v-model="reader.phai" class="form-control" required>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Địa chỉ</label>
        <input
          v-model="reader.diaChi"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Điện thoại</label>
        <input
          v-model="reader.dienThoai"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Mật khẩu</label>
        <input
          v-model="reader.password"
          type="password"
          class="form-control"
          required
        />
      </div>

      <button type="submit" class="btn-add" v-if="!isUpdating">
        Cập nhật độc giả
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
import DocgiaService from "@/services/docgia.service";

const router = useRouter();
const route = useRoute();

const reader = ref({
  hoLot: "",
  ten: "",
  ngaySinh: "",
  phai: "Nam",
  diaChi: "",
  dienThoai: "",
  password: "",
});

const isUpdating = ref(false);

const submitForm = async () => {
  isUpdating.value = true;
  try {
    await DocgiaService.update(route.params.id, reader.value);
    alert("Cập nhật độc giả thành công!");
    router.push("/admin/readers");
  } catch (error) {
    console.error("Lỗi khi cập nhật độc giả:", error);
  } finally {
    isUpdating.value = false;
  }
};

// Fetch reader data if not passed via route state
onMounted(async () => {
  if (!route.state?.reader) {
    try {
      const data = await DocgiaService.get(route.params.id);
      reader.value = data;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu độc giả:", error);
    }
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
