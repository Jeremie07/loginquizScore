import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'



// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA9NSRXrTNlgT9_X3HtVYry9_kgxcKDt4",
  authDomain: "vuelogin-quiz.firebaseapp.com",
  databaseURL: "https://vuelogin-quiz-default-rtdb.firebaseio.com",
  projectId: "vuelogin-quiz",
  storageBucket: "vuelogin-quiz.appspot.com",
  messagingSenderId: "941478094079",
  appId: "1:941478094079:web:84c907f8f4d7c5628818ca",
  measurementId: "G-E8401Y7Y9J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
loadFonts()


createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')

