import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase



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

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

db.settings({ timestampsInSnapshots: true})
  export default db;