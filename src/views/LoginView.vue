<script setup>
import Form from '../components/Form.vue'
import { useStoreAuth } from '@/stores/auth_store'
import { storeToRefs } from 'pinia'
const auth_store = useStoreAuth()
const { isLoggedin } = storeToRefs(auth_store)
</script>

<template>
  <main>
    <Form @submit-form="auth_store.LoginUser" />
  </main>
</template>
