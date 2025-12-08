 import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/Home.vue';
import About from '../pages/About.vue';
import Artists from '../pages/Artists.vue';
import Genres from '../pages/Genres.vue';
import Schedule from '../pages/Schedule.vue';
import Tickets from '../pages/Tickets.vue';
import Contacts from '../pages/Contacts.vue';

const routes = [
  { path: '/', component: About },
  { path: '/artists', component: Artists },
  { path: '/genres', component: Genres },
  { path: '/schedule', component: Schedule },
  { path: '/tickets', component: Tickets },
  { path: '/contacts', component: Contacts }
];

export default createRouter({
  history: createWebHistory(),
  routes
});

