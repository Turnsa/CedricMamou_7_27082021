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
          <div v-if="currentUser.userId == post.User.id || user.isAdmin" @click="modifyPost(post.id)" class="modifyPost">
            <i class="fa-solid fa-ellipsis"></i>
          </div>
          <div class="blocModale" v-if="reveleUpdate">
            <div class="overlay" @click="toggleModaleUpdate"></div>
            <div class="modale card col-md-8 col-xl-4">
              <h2>Modifier la publication</h2>
              <input type="text" v-model.trim="newContent" placeholder="Votre nouvelle publication" class="newContent">
              <div class="button">
              <button @click="updatePublication()" class="btn btn-oui btn-primary">Modifier</button>
              </div>
            </div>
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
      reveleUpdate: false,
      user: {},
      post: {},
      posts: [],
      comments: [],
      content: "",
      newContent: "",
      postId: "",
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

    // Modification d'une publication
    modifyPost(id) {
      console.log(id);
      this.postId = id;
      this.reveleUpdate = !this.reveleUpdate;
    },
    toggleModaleUpdate : function() {
      this.reveleUpdate = !this.reveleUpdate;
    },
    updatePublication() {
      const id = this.postId;

      const self = this;

      axios.put(`http://localhost:3000/api/post/${id}`,
      {
        content: self.newContent,
      },
      {
        headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.currentUser.token}`
                },
      }).then((response) => {
        self.postId="",
        self.newContent="",
        self.reveleUpdate = !self.reveleUpdate;
        self.getPosts();
        console.log(response);
      })
    },
    // suppression d'un publication
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
.modifyPost {
  cursor: pointer;
  position: absolute;
  top: 8px;
  right: 25px;
}
.modale {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f1f1f1;
  color: #333;
  padding: 30px;
  position: fixed;
  box-shadow: 5px 5px 5px #9C9C9C;
}
.overlay {
  background: rgba(255, 255, 255, 0);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.blocModale {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-oui{
  margin-top:40px;
  width: 150px;
}
.newContent {
  margin-top: 30px;
  padding: 15px;
  width: 90%;
  height: 50px;
  border-radius: 15px;
  font-size: 1.7em;
}
</style>