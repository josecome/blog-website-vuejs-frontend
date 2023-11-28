<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
const route = useRoute()
const post = ref([])
const initialState = ref(false)
const txtcomment = ref('')
const link = ref('http://127.0.0.1:8000/api/')
const link_path = ref(route.params.lnk)
const localToken = ref(localStorage.getItem('token'))

onBeforeMount(() => {
    console.log(`${link.value}post/${link_path.value}`)
    axios.get(`${link.value}post/${link_path.value}`).then((data) => {
      console.log('=======================================')
      console.log(data.data)
      post.value = data.data
    })
})
const setData = async (i) => {
  
  const v = {comment: txtcomment.value, post: i }
  await axios
    .post(`${link.value}comments/`, v, {
      headers: {
        Accept: 'application/json',
        Authorization:  `Bearer ${ localStorage.getItem('token') }`,
      }
    })
    .then(
      (response) => {
        var rs_response = response.data
        console.log('===============v1===================')
        console.log(rs_response)
      },
      (error) => {
        var rs_response = error
        console.log('===============v2===================')
        console.log(rs_response)
      }
    )
}
</script>

<template>
        <div class="div_content_style"
             style="background-color: white;
                    margin: 16px;
                    padding: 40px;
                    border-radius: 26px;
                    width: 90%;
                    overflow: hidden">
            <div style="float: left; width: 560px;">
                <h3>{{ post[0].title }}</h3>
                <p>{{ post[0].post_content }}</p>
            </div>
            <div style="width: 460px;
                        margin-top: 2px;
                        float: right;
                        border: 1px solid gray">
                <span class="userstylepic" style="margin: 10px;">
                    <strong style="color: white;">F</strong>
                </span>
                <br />
                <span style="padding: 10px;">{{ post[0].date_created }}</span>
                <span style="margin-left: 12px; padding: 10px; background-color: #A9F764; color: blue; border: 4px solid blue; border-radius: 20px;">{{ post[0].post_type  }}</span>
                <br>
                <br />
                <div style="padding-left: 10px; margin-left: 10px">
                <i class="bi bi-hand-thumbs-up" style="padding-right: 10px">
                    {{ post[0].count_likes }}
                  </i>
                  <i class="bi bi bi-heart" style="padding-right: 10px">
                    {{ post[0].count_loves }}
                  </i>
                  <i class="bi bi-hand-thumbs-down" style="padding-right: 10px">
                    {{ post[0].count_sads }}
                  </i>
                  <i class="bi bi-chat-left" style="padding-right: 10px">
                    {{ post[0].count_comments }}
                  </i>
                  <i class="bi bi-share">
                    {{ post[0].count_shares }}
                  </i>
                </div>
                <br />
                <strong style="padding: 10px; margin: 10px">Comments</strong>
                <br />
                <div>
              <label class="userclassPic2 centerText"
                ><span>{{ post[0].topic }}</span></label
              >
              <div class="divcommentclass, container">
                <input
                  type="text"
                  class="commentclass, content"                  
                  placeholder="Write a comment..."
                  v-model="txtcomment"
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
                @click="(e) => setData(post[0].id)"
              >
                Post
              </i>
            </div>
                <br />
                <hr style="width: 92%;" />
                <div v-for="comment in post[0].comments"
                     style="width: 100%;
                            padding: 10px;
                            margin: 10px">
                    {{ comment.comment }}
                    <br />
                    <i class="bi bi-hand-thumbs-up" style="padding-right: 10px">
                        {{ comment.count_likes }}
                      </i>
                      <i class="bi bi bi-heart" style="padding-right: 10px">
                        {{ comment.count_loves }}
                      </i>
                      <i class="bi bi-hand-thumbs-down" style="padding-right: 10px">
                        {{ comment.count_sads }}
                      </i>
                    <br />
                    <hr style="width: 92%;" />
                </div>
            </div>
        </div>
</template>
