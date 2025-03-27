<template>
  <div class="admin-layout">
    <header class="main-header">
      <div class="container">
        <div class="header-content">
          <h1 class="app-title">Quản Lý Thư Viện</h1>
          <div class="user-info">
            <span class="user-name">{{ adminName }}</span>
            <button class="btn-logout" @click="logout">
              <i class="fas fa-sign-out-alt"></i> Đăng xuất
            </button>
          </div>
        </div>
        <nav class="main-nav">
          <router-link to="/admin/books" class="nav-link">
            <i class="fas fa-book"></i> Sách
          </router-link>
          <router-link to="/admin/readers" class="nav-link">
            <i class="fas fa-users"></i> Độc giả
          </router-link>
          <router-link to="/admin/borrowing" class="nav-link">
            <i class="fas fa-exchange-alt"></i> Mượn/Trả
          </router-link>
          <router-link to="/admin/publishers" class="nav-link">
            <i class="fas fa-building"></i> Nhà xuất bản
          </router-link>
          <router-link to="/admin/employees" class="nav-link">
            <i class="fas fa-user-tie"></i> Nhân viên
          </router-link>
        </nav>
      </div>
    </header>
    
    <main class="main-content">
      <div class="container">
        <slot></slot>
      </div>
    </main>
    
    <footer class="main-footer">
      <div class="container">
        <p>&copy; 2025 Hệ Thống Quản Lý Thư Viện</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const adminName = ref('');

onMounted(() => {
  adminName.value = localStorage.getItem('hotennv') || 'Admin';
});

const logout = () => {
  localStorage.removeItem('hotennv');
  localStorage.removeItem('chucvu');
  localStorage.removeItem('userRole');
  router.push('/admin-login');
};
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.app-title {
  font-size: 1.5rem;
  margin: 0;
  color: var(--primary-color);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: 500;
}

.btn-logout {
  background: none;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.main-nav {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.nav-link {
  color: var(--dark-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.nav-link:hover {
  background-color: #f5f7fa;
}

.nav-link.router-link-active {
  background-color: var(--primary-color);
  color: white;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.main-footer {
  background-color: #fff;
  padding: 1rem 0;
  text-align: center;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .user-info {
    width: 100%;
    justify-content: space-between;
  }
  
  .main-nav {
    flex-wrap: nowrap;
    padding-bottom: 0.5rem;
  }
}
</style>