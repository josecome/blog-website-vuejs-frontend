import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useStoreAuth = defineStore('auth_store', () => {
  const isLoggedin = ref(false)
  const localToken = ref('no_token')
  const UserName = ref('')
  const Email = ref('')
  const Password = ref('')
  const link = ref('http://127.0.0.1:8000/api/token/')

  const requestLogin = async () => {
    console.log('================V1====================')
    console.log(UserName.value)
    console.log(Password.value)
    const v = { username: UserName.value, password: Password.value }
    const res = await axios.post(link.value, v, {
      headers: {
        Accept: 'application/json',
        //'Content-Type': 'application/json',
        Authorization: `Bearer ${ localToken.value }`
      }
    })
    console.log('======================================')    
    console.log(res)
    var data_access = res.data.access;
    localStorage.setItem('token', data_access)
    if(data_access.length && data_access.length > 10) {
      isLoggedin.value = true;
    }
    return 'success'
  }
  //isLoggedin.value = true
  function LoginUser() {
    link.value = 'http://127.0.0.1:8000/api/token/'
    requestLogin()
  }
  function LoginUserByToken() {
    localToken.value = localStorage.getItem('token')
    link.value = 'http://127.0.0.1:8000/token/verify/'
    requestLogin()
  }

  const userRegistration = reactive({ name: '', email: '', password: '' })

  return { isLoggedin, LoginUser, LoginUserByToken, UserName, Email, Password }
})
