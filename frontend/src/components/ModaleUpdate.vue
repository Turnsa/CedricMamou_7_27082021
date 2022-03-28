<template>
  <div class="blocModale" v-if="reveleUpdate">
    <div class="overlay" @click="toggleModaleUpdate"></div>
    <div class="modale card col-4 offset-4" v-if="beforeUpdate">
      <div @click="toggleModaleUpdate" class="btn-modale btn btn-danger">X</div>
      <div class="modale__content">
        <div class="updateInfos form-row">
        <div>
            <input v-model.trim="nom" class="form-row__input" type="text" placeholder="Nom"/>
            <p class="error" v-if="errorNom == true">Nom invalide</p>
        </div>
        <div>
            <input v-model.trim="prenom" class="form-row__input" type="text" placeholder="Prénom"/>
            <p class="error" v-if="errorPrenom == true">Prénom invalide</p>
        </div>
        <div>
            <input v-model.trim="password" class="form-row__input" type="password" placeholder="Mot de passe"/>
            <p class="error" v-if="errorPassword == true">{{ errorPassword.error}}</p>
        </div>
      </div>
      <div class="validate">
        <button class="btn btn-primary" @click="updateAccount()">Valider les modifications</button>
      </div>
      </div>
    </div>
    <div class="modale card col-4 offset-4" v-else>
        <div @click="toggleModaleUpdate" class="btn-modale btn btn-danger">X</div>
        <p class="modale__succes">Votre compte a été modifié.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ModaleUpdate",
  props: ["reveleUpdate", "toggleModaleUpdate"],
  data() {
    return {
        currentUser: JSON.parse(localStorage.getItem('storage')),
        beforeUpdate: true,
        nom: "",
        prenom: "",
        password: "",
        errorNom: false,
        errorPrenom: false,
        errorPassword: {},
    };
  },
  methods: {
    updateAccount() {
        const validateNames = new RegExp("^[a-zA-Z ,.'-]+$");
        const validatePassword = /^(?=.*\d).{4,8}$/;

        let id = this.currentUser.userId;
        
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
            // this.$store.dispatch('getUserById');
            console.log(response);
        }).catch((error) => {
          console.dir(error.response.data.error);
          self.errorPassword = error.response.data.error;
      })
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.bloc-modale {
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
.updateInfos {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.error {
    color: red;
}
</style>