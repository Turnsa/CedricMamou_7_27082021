<template>
    <div class="blocModale" v-if="revelePhoto">
        <div class="overlay" @click="toggleModalePhoto"></div>
        <div class="modale card col-4 offset-4">
            <div @click="toggleModalePhoto" class="btn-modale btn btn-danger">X</div>
            <h2>Voulez-vous changer de photo de profil ?</h2>
            <div class="">
                <input type="file" @change="uploadImage" ref="fileInput" name="image" id="image" accept="image/png, image/jpeg, image/jpg">
                <!-- <button @click="$refs.fileInput.click()" class="btn btn-primary">Selectionner une photo</button> -->
                <button @click="changePhoto()" class="btn btn-primary">Cliquez pour valider</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "ModalePhoto",
    props: ["revelePhoto", "toggleModalePhoto"],
    data() {
        return {
            currentUser: JSON.parse(localStorage.getItem('storage')),
        }
    },
    methods: {
        uploadImage (event) {
            this.imageUrl = event.target.files[0]
    },
        changePhoto() {``
            let id = this.currentUser.userId;
            const fd = new FormData();
            fd.append('image', this.imageUrl, this.imageUrl.name);
            axios.put(`http://localhost:3000/api/user/upload/${id}`, fd, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.currentUser.token}` 
        }
            }).then((response) => {
                console.log(response);
            })
        } ,
    },
}
</script>

<style lang="scss" scoped>
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
}
.btn-modale {
  position: absolute;
  top: 10px;
  right: 10px;
}
.btn-oui{
    width: 30%;
}
.btn-non{
    width: 30%;
}
</style>