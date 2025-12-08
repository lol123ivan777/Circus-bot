<template>
  <div class="sidebar" :class="{ open: isOpen }">
    <div class="menu">
      <button @click="go('/')" class="item">🎪 О цирке</button>
      <button @click="go('/artists')" class="item">✨ Артисты</button>
      <button @click="go('/news')" class="item">📰 Новости</button>
      <button @click="go('/genres')" class="item">🐅 Жанры</button>
      <button @click="go('/schedule')" class="item">📅 Расписание</button>
      <button @click="go('/tickets')" class="item">🎟 Билеты</button>
      <button @click="go('/contacts')" class="item">☎️ Контакты</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['isOpen'],
  methods: {
    go(path) {
      this.$router.push(path);
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 240px;
  background: #4c0000;
  color: gold;
  transform: translateX(-100%);
  transition: 0.4s ease;
  padding-top: 60px;
  z-index: 10;
}

.sidebar.open {
  transform: translateX(0);
}

.item {
  width: 100%;
  background: transparent;
  border: none;
  padding: 16px;
  text-align: left;
  color: gold;
  font-size: 18px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.25);
}
</style>

