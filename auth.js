import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js";
import { getFirestore, collection, where, query, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyC7Sf4npG0vAB301oBnVkbsDZhwuuU_8Hw",
    authDomain: "gameshare-f4567.firebaseapp.com",
    projectId: "gameshare-f4567",
    storageBucket: "gameshare-f4567.appspot.com",
    messagingSenderId: "18700875047",
    appId: "1:18700875047:web:b26463b4eeab61c31ee502"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let buffering = false;

auth.onAuthStateChanged(async user => {
    if (user && !buffering)
    {
        console.log(user.uid)
        window.uid = user.uid;
        if (location.pathname.split("/").slice(-1) == 'login.html' || location.pathname.split("/").slice(-1) == 'signup.html') {
            window.location = 'home.html';
        }
    }
    else if (!buffering)
    {
        window.uid = undefined;
        if (location.pathname.split("/").slice(-1) != 'login.html' && location.pathname.split("/").slice(-1) != 'signup.html') {
            window.location = 'login.html';
        }
    }
});

window.signup = async function (email, password, displayName) {
    let usernameCheck = await query(collection(db, "users"), where("displayName", "==", displayName));
    let nameFree = await getDocs(usernameCheck);
    nameFree = nameFree.empty;
    if (nameFree) {
        buffering = true;
        createUserWithEmailAndPassword(auth, email, password).then(function(userCredential) {
            setDoc(doc(db, "users", userCredential.user.uid), {
                currentlyPlaying: "",
                favoriteGames: "",
                friends: "",
                status: "",
                displayName: displayName,
                userId: userCredential.user.uid
            }).then(function() {
                buffering = false;
                window.location = 'home.html';
            });
        })
    }
}

window.login = function(email, password) {
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
        console.log(error.message);
    });
}

window.logout = function() {
    auth.signOut();
}