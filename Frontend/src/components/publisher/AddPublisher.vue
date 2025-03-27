<template>
  <div class="container mt-4">
    <h2>Thêm Nhà Xuất Bản</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label class="form-label">Tên nhà xuất bản</label>
        <input
          v-model="publisher.tennxb"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Địa chỉ</label>
        <input
          v-model="publisher.diachi"
          type="text"
          class="form-control"
          required
        />
      </div>

      <button type="submit" class="btn-add">Thêm nhà xuất bản</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import NhaxuatbanService from "@/services/nhaxuatban.service";

const router = useRouter();

const publisher = ref({
  tennxb: "",
  diachi: "",
});

const submitForm = async () => {
  try {
    await NhaxuatbanService.create(publisher.value);
    alert("Thêm nhà xuất bản thành công!");
    router.push("/admin/publishers");
  } catch (error) {
    console.error("Lỗi khi tạo nhà xuất bản:", error);
  }
};
</script>

<style scoped>
.btn-add {
  background-color: #3498db;
  color: white;
  padding: 5px 15px;
}
</style>
