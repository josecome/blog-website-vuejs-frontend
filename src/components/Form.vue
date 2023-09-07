<script setup>
import Button from '../components/Button.vue'
import Label from '../components/Label.vue'
import { reactive } from 'vue'
import { useStoreAuth } from '@/stores/auth_store'
import { storeToRefs } from 'pinia'
const auth_store = useStoreAuth()
const { isLoggedin, LoginUser, UserName, userLoginData, Email, Password } = storeToRefs(auth_store)
const user = reactive({ email: '', password: '' })
const emit = defineEmits(['submitForm'])
function submit() {
  Email.value = user.email
  Password.value = user.password
  emit('submitForm')
}
</script>

<template>
  <div id="login_div" class="container d-flex align-items-center justify-content-center">
    <form @submit.prevent>
      <div class="mb-3">
        <label for="InputEmail1" class="form-label">Email address</label>
        <input
          type="text"
          class="form-control"
          name="username"
          id="InputEmail1"
          v-model="user.email"
        />
        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
      </div>
      <div class="mb-3">
        <label for="InputPassword1" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          name="password"
          id="InputPassword1"
          v-model="user.password"
        />
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="Check1" />
        <label class="form-check-label" for="Check1">Check me out</label>
      </div>
      <Button
        type="submit"
        @log-in="submit"
        :text="'Submit'"
        :color="'#73C6B6'"
        :class_name="'btn btn-primary'"
      />
    </form>
  </div>
</template>
