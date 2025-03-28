<template>
  <AdminLayout>
    <router-view></router-view>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue';
</script>

<style scoped>
/* Giữ lại các style đặc thù cho hiển thị sách */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.book-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: var(--transition);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.book-image-container {
  height: 250px;
  padding: 15px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-image {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.book-image img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.book-image img.fallback-image {
  box-shadow: none;
  opacity: 0.8;
}

.book-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #f0f0f0;
}

.book-title {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: var(--dark-color);
}

.book-author, .book-publisher {
  margin: 0.2rem 0;
  color: var(--gray-color);
  font-size: 0.9rem;
}

.book-details {
  display: flex;
  justify-content: space-between;
  margin: 0.8rem 0;
  font-size: 0.9rem;
}

.book-status {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.available {
  color: #4cc9f0;
  font-weight: 600;
}

.unavailable {
  color: #f72585;
  font-weight: 600;
}

.quantity {
  color: var(--gray-color);
}

.btn-borrow {
  margin-top: auto;
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.6rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-borrow:hover {
  background-color: var(--secondary-color);
}

.btn-borrow:disabled {
  background-color: var(--gray-color);
  cursor: not-allowed;
}

.no-books {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: var(--gray-color);
}

.no-books i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .book-image-container {
    height: 200px;
  }
  
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}
</style>