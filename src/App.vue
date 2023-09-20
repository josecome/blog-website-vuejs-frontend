<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { computed } from '@vue/reactivity'
import { useStoreAuth } from '@/stores/auth_store'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
const route = useRoute()
const router = useRouter()
const pth = computed(() => route.path)
const auth_store = useStoreAuth()
const { isLoggedin } = storeToRefs(auth_store)
watch(isLoggedin, () =>
  route.name === 'dashboard' && !isLoggedin.value ? router.push({ name: 'login' }) : ''
)
onMounted(() => {
  auth_store.LoginUserByToken()
  route.name === 'dashboard' && !isLoggedin.value ? router.push({ name: 'login' }) : ''
})
console.log('Route Name: ' + route.name)
</script>

<template>
  <header v-show="route.name !== 'dashboard'">
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="45" height="45" />
    <span>Blog Webpage</span>
    <nav style="float: right">
      <RouterLink to="/login">Login</RouterLink>/
      <RouterLink to="/create_account">Register</RouterLink>
    </nav>
  </header>

  <RouterView />
  <Footer />
</template>
<style>
@import 'bootstrap/dist/css/bootstrap.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';
</style>
<style scoped></style>
