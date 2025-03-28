<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-icon">
        <i class="fas fa-lock"></i>
      </div>
      <h1>403</h1>
      <h2>Không có quyền truy cập</h2>
      <p>Rất tiếc, bạn không có quyền truy cập vào trang này.</p>
      <div class="action-buttons">
        <router-link to="/user" class="btn-home">
          <i class="fas fa-home"></i> Trang chủ
        </router-link>
        <router-link to="/user-login" class="btn-login">
          <i class="fas fa-sign-in-alt"></i> Đăng nhập
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  padding: 20px;
}

.error-container {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  max-width: 500px;
  width: 90%;
  animation: slideIn 0.5s ease;
  position: relative;
  overflow: hidden;
}

.error-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background-color: var(--warning-color);
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.error-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  background-color: rgba(248, 150, 30, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon i {
  font-size: 3.5rem;
  color: var(--warning-color);
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: var(--warning-color);
  line-height: 1;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0.5rem 0 1.5rem;
  color: var(--dark-color);
  font-size: 1.8rem;
}

p {
  margin-bottom: 2rem;
  color: var(--gray-color);
  font-size: 1.1rem;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-home, .btn-login {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  padding: 0.8rem 1.8rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  font-weight: 500;
  font-size: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-home {
  background-color: var(--primary-color);
  color: white;
}

.btn-login {
  background-color: white;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.btn-home:hover, .btn-login:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.btn-home:hover {
  background-color: var(--secondary-color);
}

.btn-login:hover {
  background-color: rgba(67, 97, 238, 0.05);
}

@media (max-width: 768px) {
  .error-container {
    padding: 2rem;
  }
  
  h1 {
    font-size: 5rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .error-icon {
    width: 80px;
    height: 80px;
  }
  
  .error-icon i {
    font-size: 2.5rem;
  }
}
</style>