<template>
  <nav v-if="isLoggedIn">
    <v-toolbar app style="background:linear-gradient(to right, #99ffcc, #0066cc)">
       <v-app-bar-nav-icon @click='toggleDrawer'></v-app-bar-nav-icon>
      <v-toolbar-title >
         </v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- dropdown menu -->
    <v-menu
      open-on-hover
    >
      <template v-slot:activator="{ props }">
        <v-btn
          class="menudiv"
          color="white"
          v-bind="props"
        >
          Menu
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          router
          :to="item.path" :prepend-icon="item.icon">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn
          color="error"
          @click="handleSignOut"
          v-if="isLoggedIn"
        >
          Sign Out
        </v-btn>
      
      
      </v-toolbar>

     <v-navigation-drawer app v-model="drawer" style="background:linear-gradient(to bottom, #99ffcc, #0066cc)">
      <span class="font-weight-light"><img class="img" src="https://scontent.fmnl17-3.fna.fbcdn.net/v/t1.15752-9/252561813_2065444936957939_2716271526608832980_n.png?_nc_cat=103&ccb=1-7&_nc_sid=ae9488&_nc_ohc=I1MpfXefXycAX9ARFT0&_nc_ht=scontent.fmnl17-3.fna&oh=03_AVKx9DFW2duGMwB683YUDNWXB7Zeuw31J7UrOHrOvDz_2w&oe=634D56D7" width="150" height="150"> </span>
      <br><br>
       <v-list-item
          v-for="item in items"
          :key="item.title"
          router 
          :to="item.path" :prepend-icon="item.icon">
          <v-list-item-title>{{item.title}}</v-list-item-title>
        </v-list-item>
      
     </v-navigation-drawer>
  </nav>
</template>

<style scoped>
.img {
  margin-top: 3%;
}

a:hover {
  background: #de813e;
}

.menudiv:hover {
  background: #373e98;
}
.img{
  margin-left: 50px;
}
</style>

<script setup>
  import { ref } from 'vue'
  import { onMounted } from 'vue';
  import { getAuth, onAuthStateChanged, signOut} from "firebase/auth"
  import { useRouter} from 'vue-router';
  const router = useRouter();
  const drawer = ref(false);

  const  items =  ref([
           { title: 'Dashboard', icon: 'mdi-view-dashboard', path: '/home' },
           { title: 'About Vuetify', icon: 'mdi-vuetify', path: '/aboutVuetify'},
           { title: 'Quiz', icon:'mdi-comment-question-outline', path: '/axiosQuiz'},
           
           { title: 'Score', icon:'mdi-comment-question-outline', path: '/score'},
        ])

 function toggleDrawer(){
  return drawer.value = !drawer.value
 }
 const isLoggedIn = ref(false);
 let auth;
 onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user)=> {
    if(user) {
      isLoggedIn.value = true;
    } else{
      isLoggedIn.value = false;
    }
  });
 });
 const handleSignOut = () => {
  signOut(auth).then(()=>{
    router.push("/");
  });
 };

 
</script>