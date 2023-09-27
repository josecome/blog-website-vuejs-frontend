<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
const route = useRoute()
const post = ref([])
const postlikes = ref([])
const postcomments = ref([])
const postshares = ref([])
const commenttxt = ref([])
const postid = ref('')
const initialState = ref(false)
const countlikes = ref(0)
const link = ref('http://127.0.0.1:8000/api/')
const link_path = ref(route.params.lnk)

const search = (k, arr, tp) => {
  var total = 0
  for (let [key, value] of Object.entries(arr)) {
    Number(key) === Number(k) ? total = Number(value) : ''
  }
  return total || 0
}

onMounted(() => {
  if (!initialState.value) {
    axios.get(`${link.value}postdata/${link_path.value}`).then((data) => {
      console.log(data.data)
      var post_data = data.data[0]
      var postid_data = data.data[0].id

      post.value = post_data
      postid.value = postid_data

      getData(`${link.value}posts/count_likes/?t=${ postid_data }`)
      getData(`${link.value}posts/count_comments/?t=${ postid_data }`)
      getData(`${link.value}posts/count_shares/?t=${ postid_data }`)
      getComments(`${link.value}post/${ postid_data }/comments/`)
    })
    initialState.value = true
  }
})
async function getComments(pg) {
  //setCountPostClick(countPostClick + 1)
  await axios.get(pg).then((data) => {
    console.log(data.data)
    commenttxt.value = data.data
  })
}

async function getData(pg) {
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

</script>

<template>
  <div style="width: 80%; padding: 20px">
    <div
      class="div_content_style"
      style="
        background-color: white;
        margin: 16px;
        padding: 40px;
        border-radius: 26px;
        width: 90%;
        overflow: hidden;
      "
    >
      <div style="float: left; width: 560px">
        <h3>{{ post.title }}</h3>
        <p>{{ post.post_content }}</p>
      </div>
      <div style="width: 460px; margin-top: 2px; float: right; border: 1px solid gray">
        <span class="userstylepic" style="margin: 10px">
          <strong style="color: white"> F </strong>
        </span>
        <br />
        <span style="padding: 10px">{{ post.date_created }}</span>
        <span style="margin-left: 12px; padding: 10px">{{ post.post_type }}</span
        ><br />
        <br />

        <span class="likesclass" style="padding: 10px">
          <i class="bi bi-hand-thumbs-up"></i>
        </span>
        {{ search(postid, postlikes, 'likes') }}
        <span class="commentMargin" style="padding: 10px">
          <i class="bi bi-chat-left"></i>
        </span>
        {{ search(postid, postcomments, 'comments') }}
        <span class="shareMargin" style="padding: 10px">
          <i class="bi bi-share"></i>
        </span>
        {{ search(postid, postshares, 'shares') }}<br />
        <hr style="width: 92%" />
        <strong>Comments</strong><br />
        <hr style="width: 92%" />
        <div v-for="c in commenttxt" style="width: 100%; padding: 10px; margin: 10px">
          {{ c.post_commented_link }}<br />
          <hr style="width: 92%" />
        </div>
      </div>
    </div>
  </div>
</template>
