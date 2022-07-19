<template>
    <div class="allComments">
        <div class="allComments__publish">
            <input class="allComments__input" v-model.trim="contentComment" type="text" placeholder="Ecrivez un commentaire...">
            <button @click="newComment()" class="btn btn-primary">Commenter</button>
        </div>
        <div class="allComments__showComment">
            <!-- <p @click="showComments()" class="showComment">Afficher les commentaires  ({{post.Comments.length}})</p> -->
            <p @click="showComments()" class="showComment">Afficher les commentaires {{}}</p>
        </div>
        <div v-show="hiddenComment" v-for="comment in comments" :key="comment.id">
            <div class="comment" v-if="id == comment.Post.id">
              <div class="comment__imgProfile">
                <img @click="toProfile(comment.User.id)" class="imgProfile" :src="comment.User.imageUrl" alt="photo de profil">
              </div>
              <div class="comment__content">
                <div class="comment__nomEtComment">
                  <div class="comment__name">
                    {{ comment.User.nom }} {{ comment.User.prenom }}
                  </div>
                  <div class="comment__comment">
                    {{ comment.comment }}
                  </div>
                </div>
                <div class="comment__date">
                  Posté le {{ formatDate(comment.createdAt) }}
                </div>
              </div>
              <div v-if="currentUser.userId == comment.User.id || user.isAdmin" @click="deleteComment(comment.id)">
                <i class="deleteCrossComment fa-solid fa-xmark"></i>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: 'Comment',
    props: ['postId'],
    data() {
        return {
            currentUser: JSON.parse(localStorage.getItem('storage')),
            hiddenComment: false,
            contentComment: "",
            id: this.postId,
            comment: {},
            comments: [],
        }
    }, 
    mounted: function() {
        this.getCurrentUser();
        this.getComments();
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
        showComments() {
            this.hiddenComment = !this.hiddenComment;
        },
        newComment() {
            let id = this.postId;
            console.log(id);
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
                    console.log(response.data);
                    this.getComments();
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
p {
  margin-bottom: 0;
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
.allComments {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
  &__publish {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    @media (min-width: 768px) {
      padding: 0 20px;
    }
  }
  &__input {
    width: 60%;
    background: #f2f2f2;
    border: solid 1px;
    border-radius: 8px;
    padding: 8px;
  }
  &__showComment {
    @media (min-width: 768px) {
      padding: 0 20px;
    }
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
.deleteCrossComment {
  cursor: pointer;
  position: relative;
  right: 15px;
  top: 3px;
}
</style>