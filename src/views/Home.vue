<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const posts = ref([])
const postlikes = ref([])
const postcomments = ref([])
const useratributes = ref([])
const postshares = ref([])
const commenttxt = ref('')
const posts_user = ref([])
const initialState = ref(false)
const link = ref('http://127.0.0.1:8000/api/')

onMounted(() => {
  if (!initialState.value) {
    axios.get(`${link.value}postlist`).then((data) => {
      var posts_data = data.data.post_data
      var likes_data = data.data.like_data
      var comments_data = data.data.comment_data
      var shares_data = data.data.share_data
      var users_data = data.data.user_data

      console.log('============vvvv======================')
      console.log(posts_data)
      posts.value = posts_data
      postlikes.value = likes_data
      postcomments.value = comments_data
      postshares.value = shares_data
      posts_user.value = users_data

      let postids = posts_data.map((i) => {
        return i.fields.user
      })
      let ids_of_posts = String(postids.filter(onlyUnique))
      loadUserAtrib(ids_of_posts)
    })
    initialState.value = true
  }
  getData(`${link.value}postlikes`)
  getData(`${link.value}postcomments`)
})
const search = (k, arr, tp) => {
  console.log('======')
  var total = 0
  for (let i = 0; i < arr.length; i++) {
    var arr_fields = arr[i].fields
    arr_fields.post === k ? (total += 1) : (total += 0)
    console.log(arr_fields.post)
  }

  return total || 0
}
function onlyUnique(value, index, array) {
  return array.indexOf(value) === index
}
async function loadUserAtrib(ids_of_posts) {
  await axios.get(`${link.value}useratrib`, { params: { ids: ids_of_posts } }).then((data) => {
    var arr = {}
    let v = data.data.split(';')
    for (var i = 0; i < v.length; i++) {
      var s = v[i].split(':')
      if (s[0] === null || s[0] === '' || s[0] === 'null' || typeof s[0] === 'undefined') {
        break
      }
      arr[s[0].trim()] = s[1].trim()
    }
    useratributes.value = arr
    console.log('User: ' + useratributes.value)
  })
}

async function getData(pg) {
  //setCountPostClick(countPostClick + 1)
  await axios.get(pg).then((data) => {
    var arr = {}
    let v = data.data.split(';')
    for (var i = 0; i < v.length; i++) {
      var s = v[i].split(':')
      if (s[0] === null || s[0] === '' || s[0] === 'null' || typeof s[0] === 'undefined') {
        break
      }
      arr[s[0].trim()] = s[1].trim()
    }
    if (pg === 'postlikes') {
      postlikes.value = arr
    } else if (pg === 'postcomments') {
      postcomments.value = arr
    }
  })
}
async function sendData(vtype_of_like, vpost_id) {
  let rs_response = ''
  let lnk = ''

  if (vtype_of_like === 'like') {
    lnk = `${link.value}addremovelike`
  } else if (vtype_of_like === 'comment') {
    lnk = `${link.value}addcomment`
  }
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  const v = { post_id: vpost_id, type_of_like: vtype_of_like, txt: commenttxt }
  await axios
    .post(lnk, v, {
      headers: {
        'X-CSRFToken': csrftoken
      }
    })
    .then(
      (response) => {
        rs_response = response.data
        console.log('rs: ' + rs_response)
        if (vtype_of_like === 'like') {
          getData('postlikes')
        } else if (vtype_of_like === 'comment') {
          getData('postcomments')
        }
      },
      (error) => {
        rs_response = error
      }
    )
}
const getUserNameFirstChar = (v) => {
  var user_name = posts_user.value.filter((i) => i.pk === v)
  return user_name[0].fields.username.split('')[0]
}
const getUserName = (v) => {
  console.log('===================')
  console.log(v)
  console.log(posts_user.value)
  var user_name = posts_user.value.filter((i) => i.pk === v)
  return user_name[0].fields.username
}
</script>

<template>
  <main>
    <div
      v-for="p in posts"
      class="div_content_style"
      style="background-color: white; margin: 16px; padding: 20px; border-radius: 26px"
    >
      <table>
        <tbody>
          <tr>
            <td>
              <a :href="'posts/' + getUserName(p.fields.user)" class="userstylepic">
                <strong style="color: white">
                  {{ getUserNameFirstChar(p.fields.user) }}
                </strong>
              </a>

              <a :href="'/posts/post/' + p.fields.link" class="classUserProfile">
                {{ p.fields.title }}
              </a>
              <br />
              <span class="timeOfPost">0 days</span>
            </td>
          </tr>
          <tr>
            <td>
              {{ p.fields.post_content.slice(0, 200) + '...' }} <br />
              <span class="likesclass">
                <i class="bi bi-hand-thumbs-up"></i>
              </span>
              {{ search(p.pk, postlikes, 'likes') }}
              <span class="commentMargin">
                <i class="bi bi-chat-left"></i>
              </span>
              {{ search(p.pk, postcomments, 'comments') }}
              <span class="shareMargin">
                <i class="bi bi-share"></i>
              </span>
              {{ search(p.pk, postshares, 'shares') }}
            </td>
          </tr>
          <tr>
            <td><hr class="lineclass" /></td>
          </tr>
          <tr>
            <td>
              <i class="bi bi-hand-thumbs-up" onClick="() => sendData('like', p.pk)"></i> Like
              <i class="bi bi-chat-left optionsclass"></i> comment
              <i class="bi bi-share optionsclass"></i> share
            </td>
          </tr>
          <tr>
            <td><hr class="lineclass" /></td>
          </tr>
          <tr>
            <td>
              <label class="userclassPic2 centerText"
                ><span>{{ p.fields.topic }}</span></label
              >
              <div class="divcommentclass, container">
                <input
                  type="text"
                  class="commentclass, content"
                  onChange="(e) => { setPostCommenttxt(e.target.value)}"
                  placeholder="Write a comment..."
                />
                <span class="commenticons, sidecontent">
                  <i class="bi bi-emoji-smile optionsclass"></i>
                  <i class="bi bi-image optionsclass"></i>
                  <i class="bi bi-hand-thumbs-up optionsclass"></i>
                  <i class="bi bi-hand-thumbs-down optionsclass"></i>
                  <i class="bi bi-heart optionsclass"></i>
                  <i class="bi bi-handbag optionsclass"></i>
                </span>
              </div>
              <i
                class="bi bi-send btnSendComment"
                title="Post Comment"
                onClick="() => sendData('comment', p.pk)"
              >
                <span class="removeclass">Post</span>
              </i>
            </td>
          </tr>
        </tbody>
      </table>
      <br /><br />
    </div>
  </main>
</template>
