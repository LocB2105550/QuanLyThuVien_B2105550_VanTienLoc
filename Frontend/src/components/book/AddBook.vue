<template>
  <div class="card">
    <h2>Thêm Sách Mới</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label class="form-label">Tên sách</label>
        <input
          v-model="book.tensach"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Tác giả</label>
        <input
          v-model="book.tacgia"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Nhà xuất bản</label>
        <select v-model="book.manxb" class="form-control" required>
          <option value="" disabled>Chọn nhà xuất bản</option>
          <option v-for="nxb in danhSachNXB" :key="nxb._id" :value="nxb._id">
            {{ nxb.tennxb }}
          </option>
        </select>
      </div>

      <div class="form-row">
        <div class="mb-3 form-col">
          <label class="form-label">Số quyển</label>
          <input
            v-model.number="book.soquyen"
            type="number"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3 form-col">
          <label class="form-label">Năm xuất bản</label>
          <input
            v-model.number="book.namxuatban"
            type="number"
            class="form-control"
            required
          />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Đơn giá</label>
        <input
          v-model.number="book.dongia"
          type="number"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Hình ảnh</label>
        <input type="file" class="form-control" @change="handleFileChange" />
        <div class="preview-container" v-if="previewUrl">
          <img :src="previewUrl" class="preview-img mt-2" />
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="goBack">Hủy</button>
        <button type="submit" class="btn-success" v-if="!isUploading">
          Thêm sách
        </button>
        <button type="button" class="btn-success" disabled v-else>
          <i class="fas fa-spinner fa-spin"></i> Đang tải lên...
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import SachService from "@/services/sach.service";
import UploadService from "@/services/upload.service";
import NhaxuatbanService from "@/services/nhaxuatban.service";

const router = useRouter();

const book = ref({
  tensach: "",
  tacgia: "",
  manxb: "",
  soquyen: 0,
  namxuatban: new Date().getFullYear(),
  dongia: 0,
  imageUrl: "",
});

const danhSachNXB = ref([]);
const isUploading = ref(false);
const selectedFile = ref(null);
const previewUrl = ref(null);

onMounted(async () => {
  try {
    danhSachNXB.value = await NhaxuatbanService.getAll();
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhà xuất bản:", error);
  }
});

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
  if (selectedFile.value) {
    previewUrl.value = URL.createObjectURL(selectedFile.value);
  }
};

const submitForm = async () => {
  if (!selectedFile.value) {
    alert("Vui lòng chọn hình ảnh cho sách!");
    return;
  }

  isUploading.value = true;
  try {
    const response = await UploadService.uploadImage(selectedFile.value);
    book.value.imageUrl = response.imageUrl;

    await SachService.create(book.value);
    alert("Thêm sách thành công!");
    router.push("/admin/books");
  } catch (error) {
    console.error("Lỗi khi tạo sách:", error);
    alert("Thêm sách thất bại!");
  } finally {
    isUploading.value = false;
    URL.revokeObjectURL(previewUrl.value);
  }
};

const goBack = () => {
  router.push("/admin/books");
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

.preview-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.preview-img {
  max-width: 200px;
  max-height: 280px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  object-fit: cover;
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