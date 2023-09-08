<script setup>
        const { createApp, ref, onMounted } = Vue
        const link_username = ref(route.params.username);
        const post = ref([])
        const postlikes = ref([]);
        const postcomments = ref([]);
        const postshares = ref([]);
        const commenttxt = ref('');
        const postid = ref('');
        const initialState = ref(false);
        const countlikes = ref(0)
        const link = ref('http://127.0.0.1:8000/api/')

        const pathname = ref(path)

        const search = (k, arr, tp) => {
            console.log('======')
            console.log(k)
            var total = 0;
            for (let i = 0; i < arr.length; i++) {
                var arr_fields = arr[i].fields
                arr_fields.post === k ? total += 1 : total += 0;
            }

            return total || 0
        };
        
        onMounted(() => {
            if(!initialState.value){
                axios.get(`${ link.value }postdata/${ link_username.value }`).then((data) => {
                    console.log(data.data) 
                    var post_data = data.data.post_data[0].fields
                    var postid_data = data.data.post_data[0].pk;
                    var like_data = data.data.like_data
                    var comment_data = data.data.comment_data
                    var shares_data = data.data.share_data

                    post.value = post_data;
                    postid.value = postid_data;
                    postlikes.value = like_data;
                    postcomments.value = comment_data;
                    postshares.value = shares_data;                    
                });    
                initialState.value = true
            }

        })
</script>