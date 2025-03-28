<template>
  <div class="book-management">
    <div class="header-actions">
      <h1>Quản lý Sách</h1>
      <router-link to="/admin/add-book" class="btn-add">
        <i class="fas fa-plus"></i> Thêm sách mới
      </router-link>
    </div>

    <div class="search-container">
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm sách..."
            @input="filterBooks"
          />
        </div>
        <div class="filter-select">
          <select v-model="filterAuthor" @change="filterBooks" class="form-control">
            <option value="">Tất cả tác giả</option>
            <option v-for="author in uniqueAuthors" :key="author" :value="author">
              {{ author }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Nhà xuất bản</th>
            <th>Số quyển</th>
            <th>Năm xuất bản</th>
            <th>Đơn giá</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in filteredBooks" :key="book.id">
            <td>
              <img :src="book.imageUrl" alt="Book Image" class="book-image" />
            </td>
            <td>{{ book.tensach }}</td>
            <td>{{ book.tacgia }}</td>
            <td>{{ getPublisherName(book.manxb) }}</td>
            <td>{{ book.soquyen }}</td>
            <td>{{ book.namxuatban }}</td>
            <td>{{ book.dongia }}</td>
            <td class="actions">
              <button class="btn btn-edit" @click="editBook(book)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-delete" @click="deleteBook(book)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredBooks.length === 0">
            <td colspan="8" class="no-data">Không có dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import SachService from "@/services/sach.service";
import NhaxuatbanService from "@/services/nhaxuatban.service";

const router = useRouter();
const allBooks = ref([]);
const searchQuery = ref("");
const filterAuthor = ref("");
const filteredBooks = ref([]);
const publishers = ref([]);

const uniqueAuthors = computed(() => {
  return [...new Set(allBooks.value.map((book) => book.tacgia))];
});

const filterBooks = () => {
  filteredBooks.value = allBooks.value.filter((book) => {
    const matchSearch =
      book.tensach.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.tacgia.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchAuthor = filterAuthor.value
      ? book.tacgia === filterAuthor.value
      : true;

    return matchSearch && matchAuthor;
  });
};

const getPublisherName = (manxb) => {
  const publisher = publishers.value.find(p => p._id === manxb);
  return publisher ? publisher.tennxb : manxb;
};

const editBook = (book) => {
  router.push(`/admin/edit-book/${book._id}`);
};

const deleteBook = async (book) => {
  if (confirm("Bạn có chắc chắn muốn xóa sách này không?")) {
    try {
      await SachService.delete(book._id);
      allBooks.value = allBooks.value.filter((b) => b._id !== book._id);
      filterBooks();
      alert("Xóa sách thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa sách:", error);
      alert("Xóa sách thất bại!");
    }
  }
};

const fetchPublishers = async () => {
  try {
    const data = await NhaxuatbanService.getAll();
    publishers.value = data;
  } catch (error) {
    console.error("Lỗi khi gọi API lấy nhà xuất bản:", error);
  }
};

const fetchBooks = async () => {
  try {
    const data = await SachService.getAll();
    allBooks.value = data.filter((book) => !book.deleted);
    filterBooks();
  } catch (error) {
    console.error("Lỗi khi gọi API lấy sách:", error);
  }
};

onMounted(async () => {
  await fetchPublishers();
  await fetchBooks();
});
</script>

<style scoped>
table tr td {
  height: 90px; 
  vertical-align: middle; 
}

.search-container {
  display: flex;
  justify-content: flex-start;
}

.search-filter {
  width: 100%;
  max-width: 600px;
}

.filter-select {
  min-width: 180px;
  max-width: 200px;
}

.book-image {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.actions {
  height: 120px;
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn {
  display: flex;
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
