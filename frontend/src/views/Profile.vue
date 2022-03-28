<template>
  <div class="">
    <Header />
    <div v-if="currentUser.userId === user.id">
      <modaleDelete :reveleDelete="reveleDelete" :toggleModaleDelete="toggleModaleDelete"></modaleDelete>
      <modaleUpdate :reveleUpdate="reveleUpdate" :toggleModaleUpdate="toggleModaleUpdate"></modaleUpdate>
      <modalePhoto :revelePhoto="revelePhoto" :toggleModalePhoto="toggleModalePhoto"></modalePhoto>
      <div class="">
        <div class="header col-5">
          <div class="header__infos">
            <div>
              <img class="header__photo" @click="toggleModalePhoto" :src="user.imageUrl" alt="photo de profile">
            </div>
            <div class="header__name">
              {{ user.nom }} {{ user.prenom }} <br>
            </div>
          </div>
          <div>
            <button @click="toggleModaleUpdate" class="btn btn-primary">Modifier le compte</button>
            <button @click="toggleModaleDelete" class="btn btn-danger">Supprimer le compte</button>
          </div>
        </div>
    </div>
      <!-- <div class="mainContent card col-5">
        <div class="mainContent__header">
          <img class="mainContent__header__photo" :src="user.imageUrl" alt="photo de profile">
          <h2>{{ user.nom }} {{ user.prenom }}</h2>
          <div class="deletePost">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div class="mainContent__title">
          <h3>contenu de la publication</h3>
          <img class="mainContent__photo" src="../../../backend/images/default/anonyme.png" alt="photo de publicaiton">
        </div>
        <div class="mainContent__comment">
          <i class="fa-regular fa-comment"></i>
        </div>
      </div> -->
    </div>
    <div v-else>
      <div class="header col-5">
          <div class="header__infos">
            <div>
              <img class="header__photo" @click="toggleModalePhoto" :src="user.imageUrl" alt="photo de profile">
            </div>
            <div class="header__name">
              {{ user.nom }} {{ user.prenom }} <br>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import ModaleDelete from "../components/ModaleDelete.vue"
import ModaleUpdate from "../components/ModaleUpdate.vue"
import ModalePhoto from "../components/ModalePhoto.vue"
// import {mapState} from "vuex";
import axios from "axios";

export default {
  name: "Profile",
  components: {
    Header,
    modaleDelete: ModaleDelete,
    modaleUpdate: ModaleUpdate,
    modalePhoto: ModalePhoto,
  },
  data() {
    return {
      currentUser: JSON.parse(localStorage.getItem('storage')),
      reveleDelete: false,
      reveleUpdate: false,
      revelePhoto: false,
      user: {}
    }
  },
  mounted: function() {
    if (this.$store.state.storage.userId == -1) {
      this.$router.push('/');
      return ;
    }
    this.getUserById();
    // this.$store.dispatch('getUserById');
    //   console.log(this.user);
  },
  // computed: {
  //   ...mapState({
  //     user: 'user',
  //     users: 'usersInfos'
  //   }),
  // },
  methods: {
    toggleModaleDelete: function() {
      this.reveleDelete = !this.reveleDelete;
    },
    toggleModaleUpdate: function() {
      this.reveleUpdate = !this.reveleUpdate;
      this.getUserById()
    },
    toggleModalePhoto: function() {
      this.revelePhoto = !this.revelePhoto;
      this.getUserById()
    },
    getUserById() {
      const url = window.location.href;
      const id = url.split("/").slice(-1)[0];
      console.log(id);


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
  }
};
</script>

<style lang="scss" scoped>
.header {
  margin: auto;
  &__infos {
    display: flex;
    align-items: center;
  }
  &__photo {
    border-radius: 50%;
    height: 150px;
    width: 150px;
    &:hover {
      cursor: pointer;
    }
  }
  &__name {
    font-size: 2em;
  }
}
.card{
  justify-content: space-between;
  padding: 8px;
  border-radius: 20px;
}
.mainContent {
  margin: auto;
  &__header {
    display: flex;
    align-items: center;
    gap: 1em;
    &__photo {
      border-radius: 50%;
      width: 50px;
    }
  }
  &__photo {
    width: 100%;
  }
  &__comment {
    cursor: pointer;
  }
}
.fa-xmark{
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
}
</style>