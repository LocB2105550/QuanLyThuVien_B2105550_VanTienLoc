<template>
  <div class="container mt-4">
    <h2>Chỉnh Sửa Sách</h2>
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

      <div class="mb-3">
        <label class="form-label">Số quyển</label>
        <input
          v-model.number="book.soquyen"
          type="number"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Năm xuất bản</label>
        <input
          v-model.number="book.namxuatban"
          type="number"
          class="form-control"
          required
        />
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
        <img v-if="previewUrl" :src="previewUrl" class="preview-img mt-2" />
      </div>

      <button type="submit" class="btn-add" v-if="!isUploading">
        Cập nhật sách
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
import SachService from "@/services/sach.service";
import UploadService from "@/services/upload.service";
import NhaxuatbanService from "@/services/nhaxuatban.service"; // Dịch vụ lấy nhà xuất bản từ API

const router = useRouter();
const route = useRoute();

const book = ref({
  tensach: "",
  tacgia: "",
  manxb: "",
  soquyen: 0,
  namxuatban: new Date().getFullYear(),
  dongia: 0,
  imageUrl: "",
});

const danhSachNXB = ref([]); // Danh sách nhà xuất bản
const isUploading = ref(false); // Trạng thái tải ảnh
const selectedFile = ref(null); // Lưu trữ file ảnh đã chọn
const previewUrl = ref(null); // URL để hiển thị ảnh preview

// Lấy danh sách nhà xuất bản từ back end khi component mounted
onMounted(async () => {
  try {
    danhSachNXB.value = await NhaxuatbanService.getAll();
    const bookId = route.params.id;
    const data = await SachService.get(bookId);
    book.value = data;
    previewUrl.value = data.imageUrl;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
  }
});

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
  if (selectedFile.value) {
    previewUrl.value = URL.createObjectURL(selectedFile.value);
  }
};

const submitForm = async () => {
  if (selectedFile.value) {
    isUploading.value = true;
    try {
      const response = await UploadService.uploadImage(selectedFile.value);
      book.value.imageUrl = response.imageUrl;
    } catch (error) {
      console.error("Lỗi tải ảnh:", error);
    } finally {
      isUploading.value = false;
      URL.revokeObjectURL(previewUrl.value);
    }
  }

  try {
    await SachService.update(route.params.id, book.value);
    alert("Cập nhật sách thành công!");
    router.push("/admin/books");
  } catch (error) {
    console.error("Lỗi khi cập nhật sách:", error);
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

.preview-img {
  max-width: 200px;
  border-radius: 5px;
}
</style>
