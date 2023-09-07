import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useStoreAuth = defineStore('auth_store', () => {
  const isLoggedin = ref(false)
  const localToken = ref('no_token')
  const UserName = ref('')
  const Email = ref('')
  const Password = ref('')
  const link = ref('http://127.0.0.1:8000/api/login/')

  const requestLogin = async () => {
    console.log('local: ' + localToken.value)
    const v = { email: Email.value, password: Password.value }
    const res = await axios.post(link.value, v, {
      headers: {
        Accept: 'application/json',
        //'Content-Type': 'application/json',
        Authorization: `Bearer ${localToken.value}`
      }
    })
    console.log(res)
    console.log(isLoggedin.value)
    if (
      typeof Email.value === 'undefined' &&
      typeof Password.value === 'undefined' &&
      res.data.loggedin === 1
    ) {
      //This user has valid token, do nothing
    } else if (res.data.loggedin === 1) {
      try {
        localStorage.removeItem('token')
      } catch (e) {
        console.log('Error: ' + e.message)
      }
      localStorage.setItem('token', res.data.token)
    } else if (res.data === 'loggedin') {
      isLoggedin.value = true
    }

    if (res.data.loggedin === 1) {
      isLoggedin.value = true
    }

    console.log(isLoggedin.value)
    return 'success'
  }
  //isLoggedin.value = true
  function LoginUser() {
    link.value = 'http://127.0.0.1:8000/api/login/'
    requestLogin()
  }
  function LoginUserByToken() {
    localToken.value = localStorage.getItem('token')
    link.value = 'http://127.0.0.1:8000/api/user/'
    requestLogin()
  }

  const userRegistration = reactive({ name: '', email: '', password: '' })

  return { isLoggedin, LoginUser, LoginUserByToken, UserName, Email, Password }
})
