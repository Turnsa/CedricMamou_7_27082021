<template>
  <div class="">
    <Header />
    <div class="main">
      <!-- section new post -->
    <div class="newPost card col-lg-7 col-xl-5">
      <div class="newPost__infos">
        <img @click="toProfile(currentUser.userId)" class="imgProfile" :src="user.imageUrl" alt="photo de profil">
        <input type="text" v-model.trim="content" class="newPost__text" placeholder="Quoi de neuf ?">
      </div>
      <div class="newPost__publish">
        <input type="file" @change="uploadImage" name="image" id="image" accept="image/png, image/jpeg, image/jpg, image/gif">
        <button type="submit" @click="newPost()" class="btn btn-primary btn-newPost">Publier</button>
      </div>
    </div>
    <!-- section wall -->
      <div class="allPosts card col-lg-7 col-xl-5" v-for="post in posts" :key="post.id" :postId="post.id">
        <div class="allPosts__header">
          <img @click="toProfile(post.User.id)" class="imgProfile" :src="post.User.imageUrl" alt="photo de profil">
          <div class="allPosts__infos">
            <h2> {{ post.User.nom }} {{ post.User.prenom }}</h2>
            <p>posté le {{ formatDate(post.createdAt) }}</p>
          </div>
          <div v-if="currentUser.userId == post.User.id || user.isAdmin" @click="deletePost(post.id)" class="deletePost">
            <i class="deleteCrossPost fa-solid fa-xmark"></i>
          </div>
        </div>
        <div class="allPosts__title">
          <h3> {{ post.content }}</h3>
        </div>
        <img v-if="post.imageURL!= null" class="allPosts__photo" :src="post.imageURL" alt="photo de publicaiton">
          <!-- section commentaire -->
          <Comment :postId="post.id"/>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Comment from "@/components/Comment.vue";
import axios from "axios";
// import {mapState} from "vuex";

export default {
  name: "Home",
  components: {
    Header,
    Comment,
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
      contentComment: "",
      imageURL: null,
      errorContent: false,
    }
  },
  mounted: function() {
    if (this.$store.state.storage.userId == -1) {
      this.$router.push('/');
      return ;
    }
    this.getCurrentUser();
    this.getPosts();
    this.getComments();
  },
  methods: {
    formatDate(input) {
      var datePart = input.match(/\d+/g),
        year = datePart[0].substring(2),
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
          self.imageURL = null;
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
        // console.log(res.data);
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
    // Section commentaires
    showComments() {
      this.hiddenComment = !this.hiddenComment;
    },
    newComment(id) {
      // const self = this
      if (this.contentComment == "") {
        this.errorContent = true;
      } else {
        axios.post(`http://localhost:3000/api/post/${id}/comment`, {
          comment: this.contentComment
        }, {
          headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.currentUser.token}` 
        }
        }).then((response) => {
        this.contentComment= "";
        this.getPosts();
        this.getComments();
        console.log(response.data);
        }).catch((error) => {
          console.log(error);
        });
      }
    },
    getComments() {
      axios.get("http://localhost:3000/api/post/comment", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.currentUser.token}` 
        }
      })
      .then((res) => {
        this.comments = res.data;
        // console.log(res.data);
      })
    },
    deleteComment(id) {
      const self = this;
      axios.delete(`http://localhost:3000/api/post/Comment/${id}`, {
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.currentUser.token}`
              },
            data: { isAdmin: self.user.isAdmin}
          })
          .then((response) => {
            console.log(response);
            this.getPosts();
            this.getComments();
          })
          .catch((error) => {
            console.log(error);
          });
    },
  },    
};
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
.newPost {
  gap: 1em;
  padding: 10px;
  &__infos {
    display: flex;
    justify-content: space-between;
    @media (min-width: 768px) {
      padding: 0 150px;
    }
    @media (min-width: 992px) {
      padding: 0 50px;
    }
  }
  &__text {
  border: solid 1px;
  border-radius: 8px;
  padding: 8px;
  width: 80%;
  background: #f2f2f2;
  @media (min-width: 768px) {
    width: 100%;
    margin-left: 20px;
    margin-right: 50px;
  }
  @media (min-width: 992px) {
    width: 100%;
    // margin-left: 50px;
  }
  }
  &__publish {
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (min-width: 768px) {
      padding: 0 200px 0 150px;
    }
    @media (min-width: 992px) {
      padding: 0 50px;
    }
  }
}
h2 {
  font-size: 1.7em;
  margin-bottom: 0;
}
p {
  margin-bottom: 0;
}
.btn-newPost {
  @media (min-width: 992px) {
      margin-right: 50px;
  }
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
.showComment {
  display: inline-block;
  cursor: pointer;
}
.comment {
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  @media (min-width: 768px) {
      padding: 0 20px;
    }
  &__imgProfile {
    margin-right: 10px;
  }
  &__content {
    width: 70%;
  }
  &__nomEtComment {
    background-color: #f2f2f2;
    border-radius: 10px;
    padding: 5px 10px;
  }
  &__name {
    font-weight: 500;
  }
  &__date {
    padding-left: 5px;
  }
}
.deleteCrossPost {
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>