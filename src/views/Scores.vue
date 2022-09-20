<template>

    <body>

        <v-row class="vrow">

            <v-col cols="5" sm="10" md="8" lg="6">

                <v-card ref="form" class="ma-15" max-width="900" max-height="auto"
                    style="background:linear-gradient(#99ffcc, #0066cc)">
                    <v-card>
                        <v-simple-table>
                            <template v-slot:default>
                                <table class="styled-table">
                                    <thead class="thead-dark">
                                        <tr style="text-align:center">
                                            <th scope="col">Email</th>
                                            <th scope="col">Score</th>
                                            <th scope="col">Timestamp</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-for="scores in quizData" :key="scores">
                                            <td>{{ scores.user }}</td>
                                            <td>{{ scores.scores }}</td>
                                            <td>{{ scores.timestamp }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </template>
                        </v-simple-table>





                    </v-card>
                </v-card>


            </v-col>
        </v-row>



        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br>
    </body>
</template>
      
<script>


import db from '@/fb'
import { collection, getDocs, orderBy } from '@firebase/firestore';
import { getAuth } from "firebase/auth";

export default {
    name: "Quiz",
    // data() function stores state variables
    data() {
        return {
            questions: [],
            loading: true,
            index: 0,
            score: 0,
            questionCurrentNumber: 1,
            quizCompleted: false,
            result: "",
            passingScore: "",
            pass: false,
            squiz: false,
            quizData: [],

        };
    },
    computed: {
        currentQuestion() {
            if (this.questions !== []) {
                return this.questions[this.index];
            }
            return null;
        },
    },

    // Custom methods of the Vue Component
    methods: {
        async fetchScore() {
            const querySnapshot = await getDocs(collection(db, "projects"));
            querySnapshot.forEach((doc) => {
                console.log(doc.data())
                //this.quizData.push(doc.data()), orderBy('score');
                this.quizData.push(doc.data());
                //console.log(doc.data(orderBy('score')));
                console.log(doc.data(orderBy('score')));
            });
        },

        async fetchQuestions() {


            this.loading = true;
            let response = await fetch(
                "https://opentdb.com/api.php?amount=10&category=32&difficulty=easy&type=multiple"
            );
            let jsonResponse = await response.json();
            let index = 0; // index is used to identify single answer
            let data = jsonResponse.results.map((question) => {
                // put answers on question into single array
                question.answers = [
                    question.correct_answer,
                    ...question.incorrect_answers,
                ];
                // Shuffle question.answers array
                for (let i = question.answers.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [question.answers[i], question.answers[j]] = [
                        question.answers[j],
                        question.answers[i],
                    ];
                }
                // add rightAnswer and key property to each question
                question.rightAnswer = null;
                question.key = index;
                index++;
                return question;
            });
            this.questions = data;
            this.loading = false;
        },
        startQuiz() {
            this.squiz = true;
            return squiz
        },
        handleButtonClick: function (event) {
            /* Find index to identiy question object in data */
            let index = event.target.getAttribute("index");

            let pollutedUserAnswer = event.target.innerHTML; // innerHTML is polluted with decoded HTML entities e.g ' from &#039;
            /* Clear from pollution with ' */
            let userAnswer = pollutedUserAnswer.replace(/'/, "&#039;");

            /* Set userAnswer on question object in data */
            this.questions[index].userAnswer = userAnswer;

            /* Set class "clicked" on button with userAnswer -> for CSS Styles; Disable other sibling buttons */
            event.target.classList.add("clicked");
            let allButtons = document.querySelectorAll(`[index="${index}"]`);

            for (let i = 0; i < allButtons.length; i++) {
                if (allButtons[i] === event.target) continue;

                allButtons[i].setAttribute("disabled", "");
            }

            /* Invoke checkAnswer to check Answer */
            this.checkAnswer(event, index);
        },
        checkAnswer: function (event, index) {
            let question = this.questions[index];

            if (question.userAnswer) {
                if (this.index < this.questions.length - 1) {
                    setTimeout(
                        function () {
                            this.index += 1;
                        }.bind(this),
                        500
                    );
                }
                if (question.userAnswer === question.correct_answer) {
                    /* Set class on Button if user answered right, to celebrate right answer with animation joyfulButton */
                    event.target.classList.add("rightAnswer");
                    /* Set rightAnswer on question to true, computed property can track a streak out of 10 questions */
                    this.questions[index].rightAnswer = true;
                    this.score++;
                } else {
                    /* Mark users answer as wrong answer */
                    event.target.classList.add("wrongAnswer");
                    this.questions[index].rightAnswer = false;
                    /* Show right Answer */
                    let correctAnswer = this.questions[index].correct_answer;
                    let allButtons = document.querySelectorAll(`[index="${index}"]`);
                    allButtons.forEach(function (button) {
                        if (button.innerHTML === correctAnswer) {
                            button.classList.add("showRightAnswer");
                        }
                    });
                }

                if (this.questionCurrentNumber < this.questions.length) {
                    this.questionCurrentNumber++;
                }
                else {
                    this.quizCompleted = true
                    const auth = getAuth();
                    const project = {
                        user: auth.currentUser.email,
                        scores: this.score,
                        timestamp: new Date(),
                    }
                    db.collection('projects').add(project).then(() => {
                        console.log("Added")
                    })
                    if (this.quizCompleted = true) {
                        this.passingScore = (0.5 * this.questions.length);
                        if (this.score >= this.passingScore) {
                            this.result = "Passed"
                            this.pass = true
                        }
                        else {
                            this.result = "Failed"
                        }
                    }
                }

            }

        },
    },

    // Code inside mounted() runs after the Component has mounted
    mounted() {
        this.fetchQuestions();
        this.fetchScore();
    },
};



</script>
      
<style scoped>

tr:nth-child(even) {
    background-color: #f2f2f2;
}
.quiz-container {
    margin: 1rem auto;
    padding: 1rem;
    max-width: 750px;
}

#resultscore {
    font-size: 2rem;
    padding: 0.5rem;
    color: #7eb2ff;
    text-align: center;
}

#quizresult {
    font-size: 2rem;
    color: #202020;
}

#quizpassed {
    font-size: 1.7rem;
    padding: 0.5rem;
    color: #67ff9a;
    text-align: center;
    border: 1px;
}

#quizfailed {
    font-size: 1.7rem;
    padding: 0.5rem;
    color: #fc0000;
    text-align: center;
    border: 1px;
}

#logo-headline {
    font-size: 2rem;
    padding: 0.5rem;
    color: #7eb2ff;
    text-align: center;
}

#logo-crown {
    display: block;
    width: 40%;
    margin: 0 auto;
}

@media only screen and (max-width: 500px) {
    #logo-crown {
        width: 30%;
    }

    #logo-headline {
        font-size: 1.8rem;
    }
}

h1 {
    font-size: 1.3rem;
    padding: 0.7rem;
}

.btn {
    color: white;
    text-align: center;
    height: auto;
    border-radius: 50px;
}

.startquizcard {
    justify-content: center;
    padding-left: 35%;
}

.divider {
    margin: 0.5rem 0;
    border: 2px solid rgba(102, 163, 255, 0.986);
    border-radius: 2px;
    box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.3);
}

form {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
}

button {
    font-size: 1.1rem;
    box-sizing: border-box;
    padding: 1rem;
    margin: 0.3rem;
    width: 47%;
    background-color: rgba(100, 100, 100, 0.3);
    border: none;
    border-radius: 0.4rem;
    box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.2);
}

button:hover:enabled {
    transform: scale(1.02);
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12),
        0 3px 1px -1px rgba(0, 0, 0, 0.2);
}

button:focus {
    outline: none;
}

button:active:enabled {
    transform: scale(1.05);
}

@keyframes flashButton {
    0% {
        opacity: 1;
        transform: scale(1.01);
    }

    50% {
        opacity: 0.7;
        transform: scale(1.02);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

button.clicked {
    pointer-events: none;
}

button.rightAnswer {
    animation: flashButton;
    animation-duration: 700ms;
    animation-delay: 200ms;
    animation-iteration-count: 3;
    animation-timing-function: ease-in-out;
    color: black;
    background: linear-gradient(210deg,
            rgba(0, 178, 72, 0.25),
            rgba(0, 178, 72, 0.5));
}

button.wrongAnswer {
    color: black;
    background: linear-gradient(210deg,
            rgba(245, 0, 87, 0.25),
            rgba(245, 0, 87, 0.5));
}

.vrow {
    justify-content: center;
    margin-right: 50% auto;
    padding-left: 5% auto;
    height: 100% auto;
    width: 100% auto;
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
    padding-top: 10px;
}

button.showRightAnswer {
    animation: flashButton;
    animation-duration: 700ms;
    animation-delay: 200ms;
    animation-iteration-count: 2;
    animation-timing-function: ease-in-out;
    color: black;
    background: linear-gradient(210deg,
            rgba(0, 178, 72, 0.25),
            rgba(0, 178, 72, 0.5));
}

body {
    background-image: url('https://1.bp.blogspot.com/-ceQant5sYeI/XOlXumFNclI/AAAAAAAADIU/pFHyN0bclmoUz6wSPNbsElcyiZ9l0_HRACKgBGAs/w3840-h2400-p-k-no-nu/anime-city-night-fireworks-scenery-uhdpaper.com-4K-182.jpg');
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
}

h5 {
    color: white;
}

form {
    color: white;
}

h1 {
    color: white;
}

table {
    text-align: center;
    border: 2px solid #202020;
}

tr:hover {
    background-color: coral;
}

th {
    background-color: #0b0d0c;
    color: white;
}

.styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}
.styled-table thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
}
.styled-table th,
.styled-table td {
    padding: 12px 15px;
}


.styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
}

.styled-table tbody tr.active-row {
    font-weight: bold;
    color: #009879;
}
</style>