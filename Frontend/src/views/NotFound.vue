<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h1>404</h1>
      <h2>Trang không tìm thấy</h2>
      <p>Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.</p>
      <router-link to="/user" class="btn-home">
        <i class="fas fa-home"></i> Trở về trang chủ
      </router-link>
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
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.error-icon {
  font-size: 4rem;
  color: var(--danger-color);
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: var(--danger-color);
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

.btn-home {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  padding: 0.8rem 1.8rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  font-weight: 500;
  font-size: 1.1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-home:hover {
  background-color: var(--secondary-color);
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
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
}
</style>