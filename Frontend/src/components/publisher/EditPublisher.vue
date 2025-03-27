<template>
  <div class="container mt-4">
    <h2>Chỉnh Sửa Nhà Xuất Bản</h2>
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

      <button type="submit" class="btn-add" v-if="!isUpdating">
        Cập nhật nhà xuất bản
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
import NhaxuatbanService from "@/services/nhaxuatban.service";

const router = useRouter();
const route = useRoute();

const publisher = ref({
  tennxb: "",
  diachi: "",
});

const isUpdating = ref(false);

const submitForm = async () => {
  isUpdating.value = true;
  try {
    await NhaxuatbanService.update(route.params.id, publisher.value);
    alert("Cập nhật nhà xuất bản thành công!");
    router.push("/admin/publishers");
  } catch (error) {
    console.error("Lỗi khi cập nhật nhà xuất bản:", error);
  } finally {
    isUpdating.value = false;
  }
};

// Fetch publisher data if not passed via route state
onMounted(async () => {
  if (!route.state?.publisher) {
    try {
      const data = await NhaxuatbanService.get(route.params.id);
      publisher.value = data;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu nhà xuất bản:", error);
    }
  } else {
    publisher.value = route.state.publisher;
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
