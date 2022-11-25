import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getDatabase, ref, set, update, get, onValue } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC7Sf4npG0vAB301oBnVkbsDZhwuuU_8Hw",
    authDomain: "gameshare-f4567.firebaseapp.com",
    projectId: "gameshare-f4567",
    storageBucket: "gameshare-f4567.appspot.com",
    messagingSenderId: "18700875047",
    appId: "1:18700875047:web:b26463b4eeab61c31ee502"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const store = getFirestore(app);

onValue(ref(db, 'threads/' + new URLSearchParams(window.location.search).get('thread')), (snapshot) => {
    if (location.pathname.split("/").slice(-1) == 'discussion.html')
    {
        renderReviews();
    }
});

onValue(ref(db, 'threads'), (snapshot) => {
    if (location.pathname.split("/").slice(-1) == 'game.html')
    {
        renderThreads();
    }
});

function renderThreads() {
    document.getElementById('agora').innerHTML = "";
    get(ref(db), '/threads/').then((snapshot) => {
        let data = snapshot.val().threads;
        for (let i = 0; i < Object.keys(data).length; i++)
        {
            if (Object.values(data)[i].game == gameid)
            {
                createThreadDOM(Object.values(data)[i].title, Object.values(data)[i].body, Object.keys(data)[i])
            }
        }
    });
}

function renderReviews() {
    document.getElementById('responses').innerHTML = "";
    const thread = new URLSearchParams(window.location.search).get('thread');
    get(ref(db), '/threads/' + thread).then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val().threads[thread];
            document.getElementById('title').innerHTML = data.title;
            document.getElementById('body').innerHTML = data.body;

            getDoc(doc(store, 'users', data.creator)).then(function(response) {
                if (response.exists())
                {
                    document.getElementById('creator').innerHTML = response.data().displayName;
                }
                else
                {
                    document.getElementById('creator').innerHTML = "[deleted]";
                }
            });

            let responses = data.responses;
            for (let i = 0; i < Object.keys(responses).length; i++)
            {
                getDoc(doc(store, 'users', Object.values(responses)[i].sender)).then(function(response){
                    let fancy_date = new Date(parseInt(Object.keys(responses)[i]));
                    createReview(response.data().displayName, fancy_date.toDateString(), Object.values(responses)[i].message)
                })
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

window.createThread = function(title, body, game)
{
    update(ref(db, 'threads/' + Date.now()), {
        title: title,
        body: body,
        creator: uid,
        game: game
    });
}

window.respondThread = function(message)
{
    const thread = new URLSearchParams(window.location.search).get('thread');
    update(ref(db, 'threads/' + thread + "/responses/" + Date.now()), {
        message: message,
        sender: uid
    });
}

window.renderThreads = function()
{
    get(ref(db), '/threads/').then((snapshot) => {
        if (snapshot.exists()) {
            let drip = Object.keys(snapshot.val().threads);
            let check = Object.values(snapshot.val().threads);
            for (let i = 0; i < drip.length; i++)
            {
                console.log(check[i]);
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

function createReview(name, time, message)
{
    let response = document.createElement('div');
    response.className = 'response-container'
    response.innerHTML = "<div class=\"row\">\n" +
        "            <div class=\"col-sm-auto discussion-creator\">\n" +
        "                <h3>" + name + "</h3>\n" +
        "                <p>" + time + "</p>\n" +
        "                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\" fill=\"white\" class=\"bi bi-person-circle\" viewBox=\"0 0 16 16\">\n" +
        "                    <path d=\"M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z\"/>\n" +
        "                    <path fill-rule=\"evenodd\" d=\"M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z\"/>\n" +
        "                </svg>\n" +
        "            </div>\n" +
        "            <div class=\"col-sm discussion-question\">\n" +
        "                <p>" + message + "</p>\n" +
        "            </div>\n" +
        "        </div>"
    document.getElementById("responses").append(response)
}

window.createThreadDOM = function(title, content, id)
{
    let thread = document.createElement('a');
    thread.href = "discussion.html?thread=" + id;
    thread.innerHTML = "<div class=\"thread-container\">\n" +
        "        <h3>" + title + "</h3>\n" +
        "        <p>" + content + "</p>\n" +
        "      </div>";
    document.getElementById("agora").append(thread)
}