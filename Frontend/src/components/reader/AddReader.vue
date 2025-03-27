<template>
  <div class="card">
    <h2>Thêm Độc Giả</h2>
    <form @submit.prevent="submitForm">
      <div class="form-row">
        <div class="mb-3 form-col">
          <label class="form-label">Họ & tên đệm</label>
          <input
            v-model="reader.hoLot"
            type="text"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3 form-col">
          <label class="form-label">Tên</label>
          <input 
            v-model="reader.ten" 
            type="text" 
            class="form-control" 
            required 
          />
        </div>
      </div>

      <div class="form-row">
        <div class="mb-3 form-col">
          <label class="form-label">Ngày sinh</label>
          <input
            v-model="reader.ngaySinh"
            type="date"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3 form-col">
          <label class="form-label">Phái</label>
          <select v-model="reader.phai" class="form-control" required>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
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
        <div class="password-field">
          <input
            v-model="reader.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            required
          />
          <button 
            type="button" 
            class="password-toggle"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="goBack">Hủy</button>
        <button type="submit" class="btn-success">Thêm độc giả</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import DocgiaService from "@/services/docgia.service";

const router = useRouter();
const showPassword = ref(false);

const reader = ref({
  hoLot: "",
  ten: "",
  ngaySinh: "",
  phai: "Nam",
  diaChi: "",
  dienThoai: "",
  password: "",
});

const submitForm = async () => {
  try {
    await DocgiaService.create(reader.value);
    alert("Thêm độc giả thành công!");
    router.push("/admin/readers");
  } catch (error) {
    console.error("Lỗi khi tạo độc giả:", error);
    alert("Thêm độc giả thất bại!");
  }
};

const goBack = () => {
  router.push("/admin/readers");
};
</script>

<style scoped>
.form-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-col {
  flex: 1;
  min-width: 200px;
}

.password-field {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-color);
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-success {
  background-color: var(--success-color);
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.btn-success:hover {
  background-color: #3bbbdd;
  transform: translateY(-2px);
}

.btn-cancel {
  background-color: var(--gray-color);
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.btn-cancel:hover {
  background-color: #5a6268;
}
</style>
