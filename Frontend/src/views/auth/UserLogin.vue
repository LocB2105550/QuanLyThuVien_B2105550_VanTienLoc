<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h2>Đăng Nhập Người Dùng</h2>
      </div>
      
      <form @submit.prevent="submitForm" class="login-form">
        <div class="form-group">
          <label class="form-label">Số điện thoại</label>
          <input
            v-model="phoneNumber"
            type="text"
            class="form-control"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Mật khẩu</label>
          <div class="password-field">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
        </div>
        
        <div class="show-password">
          <label>
            <input 
              type="checkbox" 
              v-model="showPassword"
            /> Hiển thị mật khẩu
          </label>
        </div>
        
        <button type="submit" class="btn-login">
          Đăng Nhập
        </button>
      </form>
      
      <div class="login-footer">
        <button class="btn-switch" @click="switchToAdminLogin">
          Đăng nhập quản trị
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import DocGiaService from "@/services/docgia.service";

const router = useRouter();
const phoneNumber = ref("");
const password = ref("");
const showPassword = ref(false);

const submitForm = async () => {
  try {
    const response = await DocGiaService.login(
      phoneNumber.value,
      password.value
    );
    
    localStorage.setItem("hoLot", response?.hoLot);
    localStorage.setItem("ten", response?.ten);
    localStorage.setItem("userId", response?._id);
    localStorage.setItem("userRole", "user");

    alert("Đăng nhập thành công!");
    router.push("/user");
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    alert("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
  }
};

const switchToAdminLogin = () => {
  router.push("/admin-login");
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: var(--transition);
  padding: 2rem;
}

.login-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-header h2 {
  margin: 0;
  color: var(--primary-color);
  font-size: 1.8rem;
}

.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a4a4a;
}

.form-control {
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  outline: none;
}

.password-field {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-color);
  cursor: pointer;
}

.show-password {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: var(--gray-color);
}

.show-password input {
  margin-right: 0.5rem;
}

.btn-login {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.btn-login:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
}

.login-footer {
  text-align: center;
}

.btn-switch {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: var(--transition);
}

.btn-switch:hover {
  text-decoration: underline;
}
</style>