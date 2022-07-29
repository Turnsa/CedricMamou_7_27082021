<template>
    <div>
        <div class="allPosts card col-lg-7 col-xl-5" v-for="post in posts" :key="post.id" :postId="post.id">
            <div class="allPosts__header">
                <img @click="toProfile(post.User.id)" class="imgProfile" :src="post.User.imageUrl" alt="photo de profil">
                <div class="allPosts__infos">
                    <h2>{{ post.User.nom }} {{ post.User.prenom }}</h2>
                    <p>posté le {{ formatDate(post.createdAt) }}</p>
                </div>
                <div v-if="currentUser.userId == post.User.id || user.isAdmin" @click="deletePost(post.id)" class="deletePost">
                    <i class="deleteCrossPost fa-solid fa-xmark"></i>
                </div>
            </div>
            <div class="allPosts__title">
                <h3>{{ post.content }}</h3>
            </div>
            <img v-if="post.imageURL!= null" class="allPosts__photo" :src="post.imageURL" alt="photo de publicaiton">
            <Comment :postId="post.id"/>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Comment from "@/components/Comment.vue";

export default {
    name: 'Post',
    components: {
        Comment,
    },
    props: ['postId'],
    data() {
        return {
           currentUser: JSON.parse(localStorage.getItem('storage')), 
           user: {},
           content: '',
           imageURL: null,
           post: {},
           posts: []
        }
    },
    mounted: function() {
        if (this.$store.state.storage.userId == -1) {
            this.$router.push('/');
            return;
        }
        this.getCurrentUser();
        this.getPosts();
    },
    methods: {
        getCurrentUser() {
            let id = this.currentUser.userId;
            axios.get(`http://localhost:3000/api/user/${id}`, {
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.currentUser.token}` 
                }
            }).then((res) => {
                this.user = res.data;
            })
        },
        formatDate(input) {
            var datePart = input.match(/\d+/g),
                year = datePart[0].substring(2),
                month = datePart[1],
                day = datePart[2];
            return day + "/" + month + "/" + year;
        },
        getPosts() {
            axios.get("http://localhost:3000/api/post", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.currentUser.token}`
                }
            }).then((res) => {
                this.posts = res.data;
                console.log(res.data);
            });
        },
        deletePost(id) {
      const self = this;
      // if (this.currentUser.token == userId) {
        axios.delete(`http://localhost:3000/api/post/${id}`, {
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.currentUser.token}`
              },
            data: { isAdmin: self.user.isAdmin}
          })
          .then((response) => {
            console.log(response);
            self.getPosts();
          })
          .catch((error) => {
            console.log(error);
          });
    },
    }
}
</script>

<style lang="scss" scoped>
.card {
  margin: auto;
  margin-bottom: 15px;
  padding-bottom: 10px;
  font-size: 0.8em;
}
.imgProfile{
  border-radius: 50%;
  width: 45px;
  height: 45px;
  object-fit: cover;
  &:hover {
    cursor: pointer;
  }
}
h2 {
  font-size: 1.7em;
  margin-bottom: 0;
}
p {
  margin-bottom: 0;
}
.allPosts {
  &__header {
    display: flex;
    align-items: center;
    gap: 1em;
    margin: 10px;
  }
  &__title {
    margin-left: 10px;
  }
  &__photo {
    margin-bottom: 10px;
  }
}
.deleteCrossPost {
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>