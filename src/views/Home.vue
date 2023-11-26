<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const posts = ref([])
const initialState = ref(false)
const link = ref('http://127.0.0.1:8000/api/')

onMounted(() => {
  var param_ids = "";
  if (!initialState.value) {
    axios.get(`${link.value}posts`).then((data) => {
      var posts_data = data.data     
      console.log('================================')
      console.log(posts_data)       
      posts.value = posts_data      
    })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
  });
  }
})
const getUserNameFirstChar = (v) => {
  return v.split('')[0]
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
              <a :href="`posts/${p.username}`" class="userstylepic">
                <strong style="color: white">
                  {{ getUserNameFirstChar(p.username) }}
                </strong>
              </a>

              <a :href="'/posts/post/' + p.link" class="classUserProfile">
                {{ p.title }}
              </a>
              <br />
              <span class="timeOfPost">{{ p.date_created }}</span>
            </td>
          </tr>
          <tr>
            <td>
              {{ p.post_content.slice(0, 200) + '...' }} <br />              
                <i class="bi bi-hand-thumbs-up padding_right">
                  <span class="padding_right2">
                  {{ p.count_likes }}
                  </span>
                </i>
                <i class="bi bi bi-heart padding_right">
                  <span class="padding_right2">
                  {{ p.count_loves }}
                  </span>
                </i>
                <i class="bi bi-hand-thumbs-down padding_right">
                  <span class="padding_right2">
                  {{ p.count_likes }}
                  </span>
                </i>
                <i class="bi bi-chat-left padding_right">
                  <span class="padding_right2">
                  {{ p.count_sads }}
                  </span>
                </i>
                <i class="bi bi-share padding_right">
                  <span class="padding_right2">
                  {{ p.count_sads }}
                  </span>
                </i> 
            </td>
          </tr>
          <tr>
            <td><hr class="lineclass" /></td>
          </tr>
          <tr>
            <td>
              <i class="bi bi-hand-thumbs-up" onClick="() => sendData('like', p.id)"></i> Like
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
