<template>
  <div class="publisher-management">
    <div class="header-actions">
      <h1>Quản lý Nhà Xuất Bản</h1>
      <router-link to="/admin/add-publisher" class="btn-add">
        <i class="fas fa-plus"></i> Thêm nhà xuất bản mới
      </router-link>
    </div>

    <div class="search-container">
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm nhà xuất bản..."
            @input="filterPublishers"
          />
        </div>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Tên nhà xuất bản</th>
            <th>Địa chỉ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(publisher, index) in filteredPublishers" :key="publisher._id">
            <td>{{ publisher.tennxb }}</td>
            <td>{{ publisher.diachi }}</td>
            <td class="actions">
              <button class="btn btn-edit" @click="editPublisher(publisher)" title="Sửa">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-delete" @click="deletePublisher(publisher)" title="Xóa">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredPublishers.length === 0">
            <td colspan="3" class="no-data">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import NhaxuatbanService from "@/services/nhaxuatban.service";

const router = useRouter();
const allPublishers = ref([]);
const searchQuery = ref("");
const filteredPublishers = ref([]);

const filterPublishers = () => {
  filteredPublishers.value = allPublishers.value.filter((publisher) => {
    const matchSearch =
      publisher.tennxb.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      publisher.diachi.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchSearch;
  });
};

const editPublisher = (publisher) => {
  router.push(`/admin/edit-publisher/${publisher._id}`);
};

const deletePublisher = async (publisher) => {
  if (confirm("Bạn có chắc chắn muốn xóa nhà xuất bản này không?")) {
    try {
      await NhaxuatbanService.delete(publisher._id);
      allPublishers.value = allPublishers.value.filter((p) => p._id !== publisher._id);
      filterPublishers();
      alert("Xóa nhà xuất bản thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa nhà xuất bản:", error);
      alert("Xóa nhà xuất bản thất bại!");
    }
  }
};

const fetchPublishers = async () => {
  try {
    const data = await NhaxuatbanService.getAll();
    allPublishers.value = data.filter((publisher) => !publisher.deleted);
    filterPublishers();
  } catch (error) {
    console.error("Lỗi khi gọi API lấy nhà xuất bản:", error);
  }
};

onMounted(() => {
  fetchPublishers();
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
