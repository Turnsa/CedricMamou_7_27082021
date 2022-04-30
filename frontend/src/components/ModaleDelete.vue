<template>
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
</template>

<script>
import axios from "axios";

export default {
    name: 'ModaleDelete',
    props: ["reveleDelete", "toggleModaleDelete"],
    data() {
        return{
            currentUser: JSON.parse(localStorage.getItem('storage')),
        }
    },
    methods: {
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
        }
    }
}
</script>

<style lang="scss" scoped>
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
}
h2 {
    font-size: 1.5em;
    text-align: center;
}
.button {
    display: flex;
    justify-content: space-between;
}
.btn-modale {
  position: absolute;
  top: 10px;
  right: 10px;
}
.btn-oui{
    width: 45%;
}
.btn-non{
    width: 45%;
}
</style>