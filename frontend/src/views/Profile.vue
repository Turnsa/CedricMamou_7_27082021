<template>
  <div>
    <Header />
    <div>
      <!-- modale update -->
      <div class="blocModale" v-if="reveleUpdate">
        <div class="overlay" @click="toggleModaleUpdate"></div>
        <div class="modale card col-md-8 col-xl-4" v-if="beforeUpdate">
          <div @click="toggleModaleUpdate" class="btn-modale btn btn-danger">X</div>
          <h2>Voulez-vous modifier ce compte ?</h2>
          <div class="modale__content">
            <div class="update">
              <div>
                  <input v-model.trim="nom" class="form-row__input" type="text" placeholder="Nom"/>
              </div>
              <div>
                  <input v-model.trim="prenom" class="form-row__input" type="text" placeholder="Prénom"/>
              </div>
              <div>
                  <input v-model.trim="password" class="form-row__input" type="password" placeholder="Mot de passe"/>
              </div>
            </div>
            <div class="validate">
              <button class="btn btn-primary" @click="updateAccount()">Valider les modifications</button>
            </div>
          </div>
        </div>
        <div class="modale card col-md-8 col-xl-4" v-else>
            <div @click="toggleModaleUpdate" class="btn-modale btn btn-danger">X</div>
            <p class="modale__succes">Votre compte a été modifié.</p>
        </div>
      </div>
      <!-- modale delete -->
      <div class="blocModale" v-if="reveleDelete">
        <div class="overlay" @click="toggleModaleDelete"></div>
        <div class="modale card col-md-8 col-xl-4">
            <div @click="toggleModaleDelete" class="btn-modale btn btn-danger">X</div>
            <h2>Voulez-vous vraiment supprimer ce compte ?</h2>
            <div class="button">
                <button @click="deleteAccount()" class="btn-oui btn btn-danger">Oui</button>
                <button @click="toggleModaleDelete" class="btn-non btn btn-primary">Non</button>
            </div>
        </div>
      </div>
      <!-- modale photo -->
      <div class="blocModale" v-if="revelePhoto">
        <div class="overlay" @click="toggleModalePhoto"></div>
        <div class="modale card  col-md-8 col-xl-4 ">
            <div @click="toggleModalePhoto" class="btn-modale btn btn-danger">X</div>
            <h2>Voulez-vous changer de photo de profil ?</h2>
            <div class="update">
                <input type="file" @change="uploadImage" ref="fileInput" name="image" id="image" accept="image/png, image/jpeg, image/jpg">
                <button @click="changePhoto()" class="validatePicture btn btn-primary">Cliquez pour valider</button>
            </div>
        </div>
      </div>
      <!--  -->
      <div class="header col-md-8 col-xl-5">
          <div>
            <img class="header__photo" @click="toggleModalePhoto" :src="user.imageUrl" alt="photo de profile">
          </div>
          <div class="header__update">
            <div class="header__name">
            {{ user.nom }} {{ user.prenom }}
          </div>
          <div class="btn-update" v-if="currentUser.userId === user.id">
            <button @click="toggleModaleUpdate" class="btn btn-primary">Modifier le compte</button>
            <button @click="toggleModaleDelete" class="btn btn-danger">Supprimer le compte</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import axios from "axios";

export default {
  name: "Profile",
  components: {
    Header,
  },
  data() {
    return {
      currentUser: JSON.parse(localStorage.getItem('storage')),
      reveleDelete: false,
      reveleUpdate: false,
      revelePhoto: false,
      user: {},
      beforeUpdate: true,
      nom: "",
      prenom: "",
      password: "",
      posts: []
    }
  },
  mounted: function() {
    if (this.$store.state.storage.userId == -1) {
      this.$router.push('/');
      return ;
    }
    this.getUserById();
  },
  methods: {
    toggleModaleDelete: function() {
      this.reveleDelete = !this.reveleDelete;
    },
    toggleModaleUpdate: function() {
      this.reveleUpdate = !this.reveleUpdate;
      this.beforeUpdate = true;
      this.getUserById()
    },
    toggleModalePhoto: function() {
      this.revelePhoto = !this.revelePhoto;
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
    // modale update account
    updateAccount() {
        const validateNames = new RegExp("^[a-zA-Z ,.'-]+$");
        const validatePassword = /^(?=.*\d).{4,8}$/;

        let id = this.currentUser.userId;
        this.beforeUpdate = true;
        validateNames.test(this.nom)
            ? (this.errorNom = false)
            : (this.errorNom = true);

        validateNames.test(this.prenom)
            ? (this.errorPrenom = false)
            : (this.errorPrenom = true);

        if (this.password != null) 
            validatePassword.test(this.password)
                ? (this.errorPassword = false)
                : (this.errorPassword = true);
        const self = this;
        axios.put(`http://localhost:3000/api/user/${id}`, 
        {
            prenom: self.prenom,
            nom: self.nom,
            password: self.password,
        }, 
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.currentUser.token}`
                },
        }).then((response) => {
            self.nom="",
            self.prenom="",
            self.password="",
            self.beforeUpdate= false,
            console.log(response);
        }).catch((error) => {
          console.dir(error.response.data.error);
          self.errorPassword = error.response.data.error;
      })
    },
    // modale delete account
    deleteAccount() {
      axios.delete(`http://localhost:3000/api/user/${this.currentUser.userId}`, {
          headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.currentUser.token}` 
          }
      }).then((response) => {
          this.$store.commit('logout');
          this.$router.push('/');
          console.log(response);
      }).catch((error) => {
          console.log(error);
      })
    },
    // modale change picture
    uploadImage (event) {
      this.imageUrl = event.target.files[0]
    },
    changePhoto() {``
      const id = this.currentUser.userId;
      const fd = new FormData();
      fd.append('image', this.imageUrl, this.imageUrl.name);
      axios.put(`http://localhost:3000/api/user/upload/${id}`, fd, {
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this.currentUser.token}` 
          }
      }).then((response) => {
        this.revelePhoto = !this.revelePhoto;
        this.getUserById()
        console.log(response);
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.header {
  margin: auto;
  padding: 10px;
  display: flex;
  align-items: center;
  &__photo {
    margin-right: 10px;
    border-radius: 50%;
    height: 80px;
    width: 80px;
    object-fit: cover;
    &:hover {
      cursor: pointer;
    }
    @media (min-width: 992px) {
      height: 100px;
      width: 100px;
    }
  }
  &__name {
    font-size: 1.5em;
  }
  &__update {
    width: 70%;
  }
}
.btn {
  font-size: 0.65em;
  // margin: 0 5px;
  &-update {
    display: flex;
  }
}
.btn-primary {
  margin-right: 10px;
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
// modales
p {
  margin: 0;
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
.overlay {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.modale {
  background: #f1f1f1;
  color: #333;
  padding: 50px;
  position: fixed;
  &__content{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__succes {
    color: blue;
    display: flex;
    justify-content: center;
  }
}
h2 {
    font-size: 1.5em;
    text-align: center;
}
.btn-modale {
  position: absolute;
  top: 10px;
  right: 10px;
}
.form-row {
  &__input {
    margin-bottom: 5px;
  }
}
.update {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.button {
    display: flex;
    justify-content: space-between;
}
.btn-oui{
    width: 45%;
}
.btn-non{
    width: 45%;
}
.validatePicture {
  margin-top: 10px;
}
</style>