<template>
  <div class="">
    <Header />
    <div class="main">
      <!-- section new post -->
    <div class="card col-5 newPost">
      <div class="newPost__infos">
        <img @click="toProfile(currentUser.userId)" class="newPost__imgProfile" :src="user.imageUrl" alt="photo de profil">
        <input type="text" v-model.trim="content" class="newPost__text" placeholder="Quoi de neuf ?">
      </div>
      <div class="newPost__publish">
        <input type="file" @change="uploadImage" name="image" id="image" accept="image/png, image/jpeg, image/jpg, image/gif">
        <button type="submit" @click="newPost()" class="btn btn-primary">Publier</button>
      </div>
    </div>
    <!-- section wall -->
      <div class="allPosts card col-5" v-for="post in posts" :key="post.id">
        <div class="allPosts__header">
          <img @click="toProfile(post.User.id)" class="allPosts__imgProfile" :src="post.User.imageUrl" alt="photo de profil">
          <h2> {{ post.User.nom }} {{ post.User.prenom }}</h2>
          <p>posté le {{ formatDate(post.createdAt) }}</p>
          <div v-if="currentUser.userId == post.User.id || user.isAdmin" @click="deletePost(post.id)" class="deletePost">
            <i class="deleteCrossPost fa-solid fa-xmark"></i>
          </div>
        </div>
        <div class="allPosts__title">
          <h3> {{ post.content }}</h3>
        </div>
          <img v-if="post.imageURL!= null" class="allPosts__photo" :src="post.imageURL" alt="photo de publicaiton">
        <div class="allPosts__comment">
          <!-- section commentaire -->
          <div class="allPosts__publish">
            <input class="allPosts__input" v-model.trim="comment" type="text" placeholder="Ecrivez un commentaire...">
            <button @click="newComment(post.id)" class="btn btn-primary">Commenter</button>
          </div>
          <div @click="showComments(post.id)">
            <p>Afficher les commentaires</p>
          </div>
          <div v-show="hiddenComment" v-for="comment in comments" :key="comment.id">
            <div class="allPosts__content" v-if="post.id == comment.Post.id">
              <div v-if="currentUser.userId == comment.User.id || user.isAdmin" @click="deleteComment(comment.id)">
                <i class="deleteCrossComment fa-solid fa-xmark"></i>
              </div>
              <div>
                <img @click="toProfile(comment.User.id)" class="photoProfile" :src="comment.User.imageUrl" alt="photo de profil">
              </div>
              <div class="nomEtComment">
                <div class="name">
                  {{ comment.User.nom }} {{ comment.User.prenom }}
                </div>
                <div class="content">
                  {{ comment.comment }}
                </div>
              </div>
              <div class="date">
                Posté le {{ formatDate(comment.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import axios from "axios";
// import {mapState} from "vuex";

export default {
  name: "Home",
  components: {
    Header,
  },
  data() {
    return {
      currentUser: JSON.parse(localStorage.getItem('storage')),
      hiddenComment: false,
      user: {},
      post: {},
      posts: [],
      comments: [],
      content: "",
      imageURL: null,
      comment: "",
      errorContent: false,
    }
  },
  mounted: function() {
    if (this.$store.state.storage.userId == -1) {
      this.$router.push('/');
      return ;
    }
    // this.$store.dispatch('getUserById');
    this.getCurrentUser();
    this.getPosts();
  },
  computed: {
    // ...mapState({
    //   user: 'user',
    // }),
  },
  methods: {
    formatDate(input) {
      var datePart = input.match(/\d+/g),
        year = datePart[0].substring(2), // get only two digits
        month = datePart[1],
        day = datePart[2];
      return day + "/" + month + "/" + year;
    },
    toProfile(id) {
      this.$router.push(`/user/${id}`)
    },
    getCurrentUser() {
      let id = this.currentUser.userId;
      axios.get(`http://localhost:3000/api/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.currentUser.token}` 
        }
      }).then((res) => {
        this.user = res.data;
        console.log(res.data);
      })
    },
    /**** Posts ****/
    uploadImage (event) {
      this.imageURL = event.target.files[0]
    },
    newPost () {
      const fd = new FormData();
      // fd.append("userId", this.userId);
      if  (this.content != "") {
        fd.append("content", this.content);
      }
      if (this.imageURL) {
        fd.append('image', this.imageURL, this.imageURL.name);
      }
      if (this.content || this.imageURL) {
        const self = this;
        axios.post('http://localhost:3000/api/post', fd, {
          headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": `Bearer ${this.currentUser.token}`
          }
        }).then((response) => {
          self.content= '';
          self.getPosts();
          console.log(response);
        }).catch((error) => {
          console.log(error);
        })
      }
    },
    getPosts() {      
      axios.get("http://localhost:3000/api/post", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.currentUser.token}` 
        }
      })
      .then((res) => {
        this.posts = res.data;
        console.log(res.data);
      });
      axios.get("http://localhost:3000/api/post/comment", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.currentUser.token}` 
        }
      })
      .then((res) => {
        this.comments = res.data;
        console.log(res.data);
      })
    },
    deletePost(id) {
      const self = this;
      // if (this.currentUser.token == userId) {
        axios.delete(`http://localhost:3000/api/post/${id}`, {
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.currentUser.token}`
              },
          })
          .then((response) => {
            console.log(response);
            self.getPosts();
          })
          .catch((error) => {
            console.log(error);
          });
    },
    // Section commentaires
    showComments() {
      this.hiddenComment = !this.hiddenComment;
    },
    newComment(id) {
      if (this.comment == "") {
        this.errorContent = true;
      } else {
        axios.post(`http://localhost:3000/api/post/${id}/comment`, {
          comment: this.comment
        }, {
          headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.currentUser.token}` 
        }
        }).then((response) => {
        this.comment= "";
        this.getPosts();
        console.log(response);
      }).catch((error) => {
        console.log(error);
      });
      // axios.get(`http://localhost:3000/api/post/${id}`), {
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${this.currentUser.token}` 
      //   }
      // }.then((res) => {
      //   console.log(res.data);
      // })
      }
    },
    deleteComment(id) {
      axios.delete(`http://localhost:3000/api/post/Comment/${id}`, {
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.currentUser.token}`
              },
          })
          .then((response) => {
            console.log(response);
            this.getPosts();
          })
          .catch((error) => {
            console.log(error);
          });
    },
  },    
};
</script>

<style lang="scss" scoped>
.main {
  margin-bottom: 30px;
}
p{
  margin: 0;
}
.error {
  color: red;
  margin: 0;
}
.card{
  padding: 20px;
  border-radius: 20px;
}
.newPost {
  margin: auto;
  align-items: center;
  gap: 1em;
  &__publish {
    display: flex;
  }
  &__infos {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
  &__text {
    border: solid 1px;
    border-radius: 8px;
    padding: 8px;
    width: 85%;
    background: #f2f2f2;
  }
  &__imgProfile{
  border-radius: 50%;
  width: 50px;
  height: 50px;
  &:hover {
    cursor: pointer;
  }
  }
}
.allPosts {
  margin: 20px auto;
  &__header {
    display: flex;
    align-items: center;
    gap: 1em;
  }
  &__photo {
    width: 100%;
  }
  &__comment {
    cursor: pointer;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  &__publish {
    margin-bottom: 10px;
  }
  &__input {
    background: #f2f2f2;
    border-radius: 8px;
    border: solid 1px;
    height: 38px;
    width: 50%;
    padding: 8px;
    margin-right: 30px;
  }
  &__content {
    display: flex;
    align-items: center;
    margin: 10px 20px;
  }
  &__imgProfile{
  border-radius: 50%;
  width: 50px;
  height: 50px;
  &:hover {
    cursor: pointer;
  }
}
}
.deleteCrossPost{
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
}
.deleteCrossComment{
  position: absolute;
  cursor: pointer;
}
.photoProfile{
  border-radius: 50%;
  height: 50px;
  width: 50px;
}
.nomEtComment {
  margin-left: 20px;
}
</style>