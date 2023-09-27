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
const posts_id = ref('')
const initialState = ref(false)
const link = ref('http://127.0.0.1:8000/api/')

onMounted(() => {
  var param_ids = "";
  if (!initialState.value) {
    axios.get(`${link.value}posts_list`).then((data) => {
      console.log(data.data)
      var posts_data = data.data
      
      posts.value = posts_data

      let postids = posts_data.map((i) => {
        return getParameterOfUrl(i.user);
      })

      let ids_of_posts = String(postids.filter(onlyUnique))

      param_ids = (posts_data.map((z) => {return 't=' + z.id + '&' })).join('')
      posts_id.value = param_ids

      loadUserAtrib(ids_of_posts)
      getData(`${link.value}posts/count_likes/`, param_ids)
      getData(`${link.value}posts/count_comments/`, param_ids)
      getData(`${link.value}posts/count_shares/`, param_ids)
    })
    initialState.value = true
  }
  console.log('------------zzzz-----------------')
  console.log(param_ids)

})
function getParameterOfUrl(u)     
{     
    u = u.replace(/\/$/, "");
    return u.substr(u.lastIndexOf('/') + 1);
} 
const search = (k, arr, tp) => {
  var total = 0
  for (let [key, value] of Object.entries(arr)) {
    Number(key) === Number(k) ? total = Number(value) : ''
  }
  return total || 0
}
function onlyUnique(value, index, array) {
  return array.indexOf(value) === index
}
async function loadUserAtrib(ids_of_posts) {
  await axios.get(`${link.value}useratrib`, { params: { ids: ids_of_posts } }).then((data) => {
    console.log(data.data)
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
  })
}

async function getData(pg, param_ids) {
  pg = pg + '?' + param_ids
  //setCountPostClick(countPostClick + 1)
  await axios.get(pg).then((data) => {
    var arr = []
    let v = data.data.split(';')
    for (var i = 0; i < v.length; i++) {
      var s = v[i].split(':')
      if (s[0] === null || s[0] === '' || s[0] === 'null' || typeof s[0] === 'undefined') {
        break
      }
      arr[s[0].trim()] = s[1].trim()
    }
    if (pg.includes('likes')) {
      postlikes.value = arr
    } else if (pg.includes('comments')) {
      postcomments.value = arr
    } else if (pg.includes('shares')) {
      postshares.value = arr
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
const getUserNameFirstChar = (k) => {
  for (let [key, value] of Object.entries(useratributes.value)) {
    if(Number(key) === Number(k)) {
       return value.split('')[0]
    }
  }
  return k
}
const getUserName = (k) => {
  for (let [key, value] of Object.entries(useratributes.value)) {
    if(Number(key) === Number(k)) {
       return value
    }
  }
  return k
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
              <a :href="'posts/' + getUserName(getParameterOfUrl(p.user))" class="userstylepic">
                <strong style="color: white">
                  {{ getUserNameFirstChar(getParameterOfUrl(p.user)) }}
                </strong>
              </a>

              <a :href="'/posts/post/' + p.link" class="classUserProfile">
                {{ p.title }}
              </a>
              <br />
              <span class="timeOfPost">0 days</span>
            </td>
          </tr>
          <tr>
            <td>
              {{ p.post_content.slice(0, 200) + '...' }} <br />
              <span class="likesclass">
                <i class="bi bi-hand-thumbs-up"></i>
              </span>
              {{ search(p.id, postlikes, 'likes') }}
              <span class="commentMargin">
                <i class="bi bi-chat-left"></i>
              </span>
              {{ search(p.id, postcomments, 'comments') }}
              <span class="shareMargin">
                <i class="bi bi-share"></i>
              </span>
              {{ search(p.id, postshares, 'shares') }}
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
                ><span>{{ p.topic }}</span></label
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
