import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth";


import HomeView from '../views/HomeView.vue'
import AxiosTriviaQuiz from '../views/AxiosTriviaQuiz.vue'
import AboutVuetify from '../views/AboutVuetify.vue'
import Register from '../views/Register.vue'
import SignIn from '../views/SignIn.vue'
import Score from '../views/Scores.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'signIn',
      component: SignIn
    },
  
      {
        path: '/axiosQuiz',
        name: 'axiosQuiz',
        component: AxiosTriviaQuiz,
        meta:{
          requiresAuth: true,
        },
      },              
      {
        path: '/aboutVuetify',
        name: 'aboutVuetify',
        component: AboutVuetify,
        meta:{
          requiresAuth: true,
        },
      },              
   
    {         
      path: '/register',
      name: 'register',
      component: Register
    },              
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta:{
        requiresAuth: true,
      },
    },
    {
      path: '/score',
      name: 'score',
      component: Score,
      meta:{
        requiresAuth: true,
      },
    },
   
  ]
})
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject  
    );
  });
};
router.beforeEach(async(to,from,next)=>{
  if(to.matched.some((record)=> record.meta.requiresAuth)){
    if(await getCurrentUser()){
      next();
    } else {
      alert("you don't have access here!");
      next("/");
    }
  }else{
    next();
  }
});
export default router
