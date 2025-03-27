<template>
  <div class="container mt-4">
    <h2>Thêm Mượn Sách</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label class="form-label">Mã độc giả</label>
        <input
          v-model="borrow.maDocGia"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Mã sách</label>
        <input
          v-model="borrow.maSach"
          type="text"
          class="form-control"
          required
        />
      </div>

      <button type="submit" class="btn-add">Thêm mượn sách</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MuonService from "@/services/muon.service";

const router = useRouter();

const borrow = ref({
  maDocGia: "",
  maSach: "",
});

const submitForm = async () => {
  try {
    await MuonService.create(borrow.value);
    alert("Thêm mượn sách thành công!");
    router.push("/admin/borrowings");
  } catch (error) {
    console.error("Lỗi khi tạo mượn sách:", error);
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
