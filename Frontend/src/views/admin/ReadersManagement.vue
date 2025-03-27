<template>
  <div class="reader-management">
    <div class="header-actions">
      <h1>Quản lý Độc Giả</h1>
      <router-link to="/admin/add-reader" class="btn-add">
        <i class="fas fa-plus"></i> Thêm độc giả mới
      </router-link>
    </div>

    <div class="search-filter">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm độc giả..."
          @input="filterReaders"
        />
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Mã độc giả</th>
            <th>Họ và tên</th>
            <th>Ngày sinh</th>
            <th>Phái</th>
            <th>Địa chỉ</th>
            <th>Điện thoại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(reader, index) in filteredReaders" :key="reader.id">
            <td>{{ reader._id }}</td>
            <td>{{ reader.hoLot }} {{ reader.ten }}</td>
            <td>{{ formatDate(reader.ngaySinh) }}</td>
            <td>
              <span :class="reader.phai === 'Nam' ? 'gender-male' : 'gender-female'">
                {{ reader.phai }}
              </span>
            </td>
            <td>{{ reader.diaChi }}</td>
            <td>{{ reader.dienThoai }}</td>
            <td class="actions">
              <button class="btn btn-edit" @click="editReader(reader)">
                <i class="fas fa-edit"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredReaders.length === 0">
            <td colspan="7" class="no-data">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import DocgiaService from "@/services/docgia.service";

const router = useRouter();
const allReaders = ref([]);
const searchQuery = ref("");
const filteredReaders = ref([]);

const filterReaders = () => {
  filteredReaders.value = allReaders.value.filter((reader) => {
    const matchSearch =
      reader.hoLot.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      reader.ten.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      reader._id.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchSearch;
  });
};

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN');
};

const editReader = (reader) => {
  router.push(`/admin/edit-reader/${reader._id}`);
};

const fetchReaders = async () => {
  try {
    const data = await DocgiaService.getAll();
    allReaders.value = data.filter((reader) => !reader.deleted);
    filterReaders();
  } catch (error) {
    console.error("Lỗi khi gọi API lấy độc giả:", error);
  }
};

onMounted(() => {
  fetchReaders();
});
</script>

<style scoped>
.gender-male {
  color: var(--info-color);
  font-weight: 500;
}

.gender-female {
  color: var(--danger-color);
  font-weight: 500;
}

.actions {
  display: flex;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--gray-color);
  font-style: italic;
}
</style>
