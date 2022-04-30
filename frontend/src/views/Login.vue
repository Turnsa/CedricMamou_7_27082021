<template>
    <div class="text-center">
        <div class="headerLogo">
            <img class="logo " src="../assets/icon-left-font-monochrome-black.svg" alt="logo de groupomania">
        </div>
        <div class="card col-11 col-md-9 col-lg-7 col-xl-5 col-xxl-3">
            <h1 class="card-title" v-if="mode == 'login' ">Connexion</h1>
            <h1 class="card-title" v-else>Inscription</h1>
            <p class="card-subtitle" v-if="mode == 'login' ">Pas encore de compte ? <span class="card__action" @click="switchToSingup()">Créer un compte</span></p>
            <p class="card-subtitle" v-else>Déjà un compte ? <span class="card__action" @click="switchToLogin()">Se connecter</span></p>
            <div class="form-row">
                <input v-model.trim="email" class="form-row__input col-8 col-md-6 col-xl-9" type="text" placeholder="Adresse mail"/>
                <p class="error" v-if="errorEmail == true">Email invalide</p>
            </div>
            <div class="form-row" v-if="mode == 'signup'">
                <input v-model.trim="nom" class="form-row__input col-8 col-md-6 col-xl-9" type="text" placeholder="Nom"/>
                <p class="error" v-if="errorNom == true">Nom invalide</p>
            </div>
            <div class="form-row" v-if="mode == 'signup'">
                <input v-model.trim="prenom" class="form-row__input col-8 col-md-6 col-xl-9" type="text" placeholder="Prénom"/>
                <p class="error" v-if="errorPrenom == true">Prénom invalide</p>
            </div>
            <div class="form-row">
                <input v-model.trim="password" class="form-row__input col-8 col-md-6 col-xl-9" type="password" placeholder="Mot de passe"/>
                <p class="error" v-if="errorPassword == true && mode == 'signup'">Mot de passe invalide (doit comprendre entre 4 et 8 caracteres et au moins 1 chiffre)</p>
                <p class="error" v-if="errorPassword == true && mode =='login'">Mot de passe invalide</p>
            </div>
            <div class="form-row error" v-if="mode == 'login' && status == 'error_login' && this.email != '' && this.password != ''">
              Adresse mail et/ou mot de passe invalide
            </div>
            <div class="form-row error" v-if="mode == 'signup' && status == 'error_signup' && this.email != '' && this.password != ''">
              Adresse mail déjà utilisée
            </div>

            <div class="form-row__button">
                <button @click="login()" class="btn btn-primary" v-if="mode == 'login'">
                  <span v-if="status == 'loading'">Connexion en cours</span>
                  <span v-else>Se connecter</span>
                </button>
                <button @click="signup()" class="btn btn-primary" v-else>
                  <span v-if="status == 'loading'">Création en cours</span>
                  <span v-else>S'inscrire</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
// import axios from "axios";
import {mapState} from "vuex";

export default {
  name: "login",
  data() {
    return {
      mode: "login",
      email: "",
      errorEmail: false,
      nom: "",
      errorNom: false,
      prenom: "",
      errorPrenom: false,
      password: "",
      errorPassword: false,
      errorLogin: "",
    };
  },
    mounted: function() {
      console.log(this.$store.state.storage);
      if (this.$store.state.storage.userId != -1) {
        this.$router.push('/home');
        return ;
      }
    },
  computed: {
    ...mapState(['status']),
  },
  methods: {
    switchToSingup() {
      this.mode = "signup";
      this.errorEmail = false;
      this.errorNom = false;
      this.errorPrenom = false;
      this.errorPassword = false;
    },
    switchToLogin() {
      this.mode = "login";
      this.errorEmail = false;
      this.errorNom = false;
      this.errorPrenom = false;
      this.errorPassword = false;
    },
    signup() {
      const validateNames = new RegExp("^[a-zA-Z ,.'-]+$");
      const validateEmail = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      const validatePassword = /^(?=.*\d).{4,8}$/;

      validateEmail.test(this.email)
        ? (this.errorEmail = false)
        : (this.errorEmail = true);

      validateNames.test(this.nom)
        ? (this.errorNom = false)
        : (this.errorNom = true);

      validateNames.test(this.prenom)
        ? (this.errorPrenom = false)
        : (this.errorPrenom = true);

      validatePassword.test(this.password)
        ? (this.errorPassword = false)
        : (this.errorPassword = true);

      const user = {
        nom: this.nom,
        prenom: this.prenom,
        email: this.email,
        password: this.password,
      };
      const self = this;

      this.$store.dispatch('signup', user)
      .then(() => {
        self.login();
      }).catch((error) => {
        console.log(error);
      })
    },
    login() {
      const user = {
        email: this.email,
        password: this.password,
      };
      const self = this;

      if (this.email == "") {
        this.errorEmail = true;
      }
      if (this.password == "") {
        this.errorPassword = true;
      }

      this.$store.dispatch('login', user)
      .then((res) => {
        self.$router.push('/home');
        console.log(res.data);
      }).catch((error) => {
        console.dir(error.response.data.error);
        this.errorLogin = error.response.data.error;
      })

    },
  },
};
</script>

<style lang="scss" scoped>
p{
  margin: 0;
  margin-top: 5px;
  @media (min-width: 768px) {
    font-size: 1.5em;
  }
  @media (min-width: 992px) {
    font-size: 1em;
  }
}
.headerLogo{
    margin-top: 50px;
}
.logo{
    width: 50%;
    @media (min-width: 768px) {
      width: 45%;
    }
    @media (min-width: 1200px) {
      width: 30%;
    }
    @media (min-width: 1400px) {
      width: 20%;
    }
}
.card{
  margin: auto;
  margin-top: 170px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 25px;
  background-color: #fad8d8;
  @media (min-width: 768px) {
    margin-top: 250px;
  }
  @media(min-width: 992px) {
    margin-top: 200px;
  }
  @media(min-width: 1200px) {
    margin-top: 90px;
  }
  &__action {
  color: #2196f3;
  &:hover{
    cursor: pointer;
    text-decoration: underline;
  }
  }
  &-title{
    @media (min-width: 768px) {
      font-size: 2.3em;
    }
    @media (min-width: 992px) {
    font-size: 2em;
  }
  }
  &-subtitle{
    @media (min-width: 768px) {
      font-size: 1.3em;
    }
    @media (min-width: 992px) {
    font-size: 1.1em;
  }
  }
}
.form-row {
  width: 100%;
  margin: 8px 0px;
  gap: 16px;
  flex-wrap: wrap;
  &__input {
    padding: 8px;
    border: none;
    border-radius: 8px;
    background: #f2f2f2;
    font-weight: 500;
    font-size: 16px;
    flex: 1;
    min-width: 100px;
    color: black;
    @media (min-width: 768px) {
      font-size: 1.5em;
    }
    @media (min-width: 1200px) {
      font-size: 1.2em;
    }
    &::placeholder {
      color: #aaaaaa;
    }
  }
}
.btn-primary {
  margin-top: 10px;
  @media (min-width: 768px) {
    font-size: 1.5em;
  }
  @media (min-width: 992px) {
    font-size: 1.3em;
  }
}
.error {
  color: red;
}
</style>