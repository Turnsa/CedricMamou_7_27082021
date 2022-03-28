<template>
    <nav class="navbar navbar-expand bg-light navbar-light">
        <div class="container">
            <a class="navbar-brand">
                <router-link to="/home" class="nav-link"><img class="logo img-fluid" alt="logo de groupomania" src="../assets/icon-left-font-monochrome-black.svg"></router-link>
            </a>
            <ul class="navbar-nav fs-2">
                <li class="nav-item active">
                    <router-link to="/home" class="nav-link"><i class="fas fa-home icon--nav"></i></router-link>
                </li>
                <li class="nav-item">
                    <router-link @click="toProfile(currentUser.userId)" to="#" class="nav-link"><i class="fas fa-user-circle icon--nav"></i></router-link>
                </li>
                <li class="nav-item">
                    <router-link @click="logout()" to="#" class="nav-link"><i class="fas fa-sign-out-alt icon--nav"></i></router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import {mapState} from "vuex";

    export default {
        name: 'Header',
        data() {
            return {
                currentUser: JSON.parse(localStorage.getItem('storage')),
            }
        },
        computed: {
            ...mapState({
            user: 'userInfos',
            }),
        },
        methods: {
            toProfile(id) {
                this.$router.push(`/user/${id}`)
            },
            logout: function () {
                this.$store.commit('logout');
                this.$router.push('/');
            },
        }
    }
</script>

<style scoped>
.logo {
    width: 300px; 
}
.navbar {
    margin-bottom: 30px;
}
</style>