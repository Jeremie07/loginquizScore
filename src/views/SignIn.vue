<template>

    <body>
        <v-row class="vrow">
            <v-col cols="12" sm="10" md="8" lg="6">
                <v-card class="ma-15" max-width="500" max-height="1000"
                    style="background:linear-gradient(to right, #99ffcc, #0066cc)">
                    <v-card-text>
                        <center>
                            <v-card-title>
                                <h2>Sign In</h2>
                            </v-card-title>
                        </center>
                        <v-text-field v-model="email" :error-messages="errorMessages" label="Enter Email"
                            placeholder="Email" required></v-text-field>
                        <v-text-field v-model="password" type="password" :error-messages="errorMessages"
                            label="Enter Password" placeholder="Password" required></v-text-field>
                    </v-card-text>
                    <v-card-actions class="vcardaction">
                        <v-btn type="text" rounded color="#00539CFF" class="btn" @click="signin">Sign In</v-btn>
                        <v-btn type="password" rounded color="#00539CFF" class="btn" @click="signInWithGoogle">Sign In
                            With Google</v-btn><br>


                    </v-card-actions>
                    <center>
                        <p>Need an Account?<router-link to="/Register"> Register</router-link>
                        </p>
                    </center>
                </v-card>
            </v-col>
        </v-row>
        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    </body>

</template>
  
  

<style scoped>
.vrow {
    justify-content: center;
    margin-right: 50%;
    padding-left: 5%;
    height: 100%;
    width: 100%;
    font-size: 15px;
    font-weight: 600;
}

.vcard {
    border-radius: 50px;
}

.vcardaction {
    display: flex;
    justify-content: center;
    align-items: center;
}

.ma-15 {
    padding-top: 25px;
}

.btn {
    background: #EEA47FFF;
}

body {
    background-image: url('https://w.wallhaven.cc/full/wy/wallhaven-wy7x97.jpg');
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
}
</style>

<script setup>


import { ref } from "vue";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router'
import { async } from "@firebase/util";

const provider = new GoogleAuthProvider();
const email = ref("");
const password = ref("");
const errMsg = ref()
const router = useRouter();

const signInWithGoogle = async(e) => {
     const auth = getAuth();
    signInWithPopup(auth, provider)
        .then((data) => {
            console.log("Successfully Sign In!");

            console.log(auth.currentUser)
            router.push('/axiosQuiz')
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });

}

const signin = () => {
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((data) => {
            console.log("Successfully Sign In!");

            console.log(auth.currentUser)
            router.push('/home')
        })
        .catch((error) => {
            console.log(error.code);
            switch (error.code) {
                case "auth/invalid-email":
                    errMsg.value = "Invalid Email";
                    break;
                case "auth/user-not-found":
                    errMsg.value = "No Account With that Email was found";
                    break;
                case "auth/wrong-password":
                    errMsg.value = "Incorrect Password";
                    break;
                default:
                    errMsg.value = "Email or Password is Incorrect";
                    break;
            }
            alert(error.message);
        });
};


</script>