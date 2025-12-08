<template>
  <div class="app">
    <Sidebar :isOpen="sidebarOpen" />

    <header class="header">
      <button class="menu-btn" @click="sidebarOpen = !sidebarOpen">☰</button>
      <h1>Цирк Никулина</h1>
    </header>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';

export default {
  components: { Sidebar },
  data() {
    return {
      sidebarOpen: false
    };
  }
}
</script>

<style>
.app {
  background: #4c0000;
  min-height: 100vh;
  color: gold;
  font-family: "Montserrat", sans-serif;
}

.header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #3b0000;
  border-bottom: 2px solid gold;
}

.menu-btn {
  font-size: 24px;
  background: transparent;
  color: gold;
  border: none;
  margin-right: 12px;
}

.content {
  padding: 16px;
}
</style>

