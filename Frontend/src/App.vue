<script>
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/* Chỉ giữ những style cơ bản mà không được định nghĩa trong modern-theme.css */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  font-family: var(--font-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

/* Thêm style cho webkit scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-color);
}
</style>