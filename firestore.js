import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, updateDoc, arrayUnion, arrayRemove, query, collection, where } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC7Sf4npG0vAB301oBnVkbsDZhwuuU_8Hw",
    authDomain: "gameshare-f4567.firebaseapp.com",
    projectId: "gameshare-f4567",
    storageBucket: "gameshare-f4567.appspot.com",
    messagingSenderId: "18700875047",
    appId: "1:18700875047:web:b26463b4eeab61c31ee502"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const gameid = new URLSearchParams(window.location.search).get('id');


window.onload = function() {
    if (location.pathname.split("/").slice(-1) == 'game.html') {
        getDoc(doc(db, "reviews", gameid)).then(function(reviews) {
            if (reviews.exists()) {
                const data = reviews.data();
                for (let i = 0; i < Object.keys(data).length; i++) {
                    let review_uid = Object.keys(data)[i];
                    let review = JSON.parse(Object.values(data)[i]);
                    getDoc(doc(db, "users", review_uid)).then(function(username) {
                        if (username.exists())
                        {
                            username = username.data().displayName;
                            createReview(username, review.stars, review.body)
                        }
                    });
                }
            }
        });
    }
}

window.setFavoriteIcon = async function () {
    if (await isInFavoriteGames(gameid, uid)) {
        document.getElementById("favoriteIcon").style.color = "gold";
    } else {
        document.getElementById("favoriteIcon").style.color = "white";
    }
}

window.setFriendIcon = async function (friendDisplayName) {
    const userDocRef = doc(db, "users", uid);
    const element = document.getElementById("friendStatusIcon");

    if (await areUsersFriends(userDocRef, friendDisplayName)) { 
        element.classList = "fa fa-minus";
        document.getElementById("addButton").style.backgroundColor = "red";
    } else {
        element.classList = "fa fa-plus";
    }
}

window.toggleGameInFavorites = async function () {
    const userDocRef = doc(db, "users", uid);

    if (await isInFavoriteGames(gameid)) {
        document.getElementById("favoriteIcon").style.color = "white";
        await updateDoc(userDocRef, {
            favoriteGames: arrayRemove(gameid)
        });
    } else {
        document.getElementById("favoriteIcon").style.color = "gold";
        await updateDoc(userDocRef, {
            favoriteGames: arrayUnion(gameid)
        });
    }
}

async function isInFavoriteGames(gameId) {
    let docSnap = await getDoc(doc(db, "users", uid));
    let favorites = docSnap.data().favoriteGames;
    return favorites.includes(gameId);
}

window.toggleFriend = async function (friendDisplayName) {
    const userDocRef = doc(db, "users", uid);

    if (await areUsersFriends(userDocRef, friendDisplayName)) {
        await addOrRemoveFriends(userDocRef, friendDisplayName, "Remove");
        const element = document.getElementById("friendStatusIcon");
        element.classList = "fa fa-plus";
        document.getElementById("addButton").style.backgroundColor = "rgb(6, 196, 22)";

    } else {
        await addOrRemoveFriends(userDocRef, friendDisplayName, "Add");
        const element = document.getElementById("friendStatusIcon");
        element.classList = "fa fa-minus";
        document.getElementById("addButton").style.backgroundColor = "red";
    }
}

async function areUsersFriends(userDocRef, friendDisplayName) {
    const userDocSnap = await getDoc(userDocRef);
    const friendQuery = query(collection(db, "users"), where("displayName", "==", friendDisplayName));
    const friendDocsSnap = await getDocs(friendQuery);

    let userFriends = userDocSnap.data().friends;
    let otherUsersFriends;
    friendDocsSnap.forEach((doc) => {
        otherUsersFriends = doc.data().friends; // This doesn't seem to work
    });


    return userFriends.includes(friendDisplayName) && otherUsersFriends.includes(userDocSnap.data().displayName);

}

async function addOrRemoveFriends(userDocRef, friendDisplayName, toggle) {
    const friendQuery = query(collection(db, "users"), where("displayName", "==", friendDisplayName));
    const friendDocsSnap = await getDocs(friendQuery);
    const userDocSnap = await getDoc(userDocRef);

    //Get the other users ID in order to change their friends array
    let friendId;
    friendDocsSnap.forEach((doc) => {
        friendId = doc.data().userId; //This doesn't work
    });

    const friendDocRef = doc(db, "users", friendId);

    if (toggle === "Remove") {
        await updateDoc(userDocRef, {
            friends: arrayRemove(friendDisplayName)
        });

        await updateDoc(friendDocRef, {
            friends: arrayRemove(userDocSnap.data().displayName)
        });
    } else if (toggle === "Add") {
        await updateDoc(userDocRef, {
            friends: arrayUnion(friendDisplayName)
        });

        await updateDoc(friendDocRef, {
            friends: arrayUnion(userDocSnap.data().displayName)
        });
    }


    return true;
}

export async function getUsernames(searchName) {
    let userNames = [];
    const userQuery = query(collection(db, "users"), where("displayName", ">=", searchName), where('displayName', '<=', searchName+ '~'));
    const userDocsSnap = await getDocs(userQuery);

    userDocsSnap.forEach((doc) => {
        userNames.push(doc.data().displayName);
    });

    return userNames;
}

window.getFavoriteGames = async function (userId) {
    let docSnap = await getDoc(query(doc(db, "users", userId)));
    let favorites = docSnap.data().favoriteGames;
    let games = [];
    for(let i = 0; i < favorites.length; i++){
        let gameName = await getGames('fields name; where id = ' + favorites[i] + ';');
        games.push([gameName[0].name, favorites[i]]);
    }
    return games;
}

window.getFriends = async function () {
    let docSnap = await getDoc(query(doc(db, "users", uid)));
    let friends = docSnap.data().friends;
    let friendList = [];
    for(let i = 0; i < friends.length; i++){
        friendList.push(friends[i]);
    }
    return friendList;
}

window.getUsername = async function () {
    let docSnap = await getDoc(query(doc(db, "users", uid)));
    let username = docSnap.data().displayName;
    return username;
}

window.uidExists = async function()
{
    return new Promise(waitForUid);
    function waitForUid(resolve, reject) {
        if (window.uid)
            resolve(window.uid);
        else
            setTimeout(waitForUid.bind(this, resolve, reject), 50);
    }
}

window.getOtherUserId = async function (friendDisplayName) {
    const friendQuery = query(collection(db, "users"), where("displayName", "==", friendDisplayName));
    const friendDocsSnap = await getDocs(friendQuery);

    //Get the other users ID in order to change their friends array
    let friendId;
    friendDocsSnap.forEach((doc) => {
        friendId = doc.data().userId;
    });

    return friendId;
}

//This may need to be added to onAuthStateChanged
async function updateStatus(status) {
    const userDocRef = doc(db, "users",uid);
    await updateDoc(userDocRef, {
        status: status.toString()
    });
}
window.getCurrentGames = async function (userId) {
    let docSnap = await getDoc(query(doc(db, "users", userId)));
    let current = docSnap.data().currentlyPlaying;
    let games = [];
    for(let i = 0; i < current.length; i++){
        let gameName = await getGames('fields name; where id = ' + current[i] + ';');
        games.push([gameName[0].name, current[i]]);
    }
    return games;
}

window.toggleGameInCurrent = async function () {
    const userDocRef = doc(db, "users", uid);

    if (await isInCurrentGames(gameid)) {
        document.getElementById("currentIcon").style.color = "white";
        await updateDoc(userDocRef, {
            currentlyPlaying: arrayRemove(gameid)
        });
    } else {
        document.getElementById("currentIcon").style.color = "#1dce5e";
        await updateDoc(userDocRef, {
            currentlyPlaying: arrayUnion(gameid)
        });
    }
}

async function isInCurrentGames(gameId) {
    let docSnap = await getDoc(doc(db, "users", uid));
    let current = docSnap.data().currentlyPlaying;
    return current.includes(gameId);
}

window.setCurrentIcon = async function () {
    if (await isInCurrentGames(gameid, uid)) {
        document.getElementById("currentIcon").style.color = "#1dce5e";
    } else {
        document.getElementById("currentIcon").style.color = "white";
    }
}


//TODO: Allow the currently playing field to be updated.
async function addUserCurrentlyPlaying(gameTitle) {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
        currentlyPlaying: gameTitle.toString()
    });
}

window.post_review = async function()
{
    let review_doc = await getDoc(doc(db, "reviews", gameid));
    let review = {
        stars: Array.from(document.getElementsByName('rate')).find(radio => radio.checked).value,
        body: document.getElementById('review__content').value
    }
    if (review_doc.exists())
    {
        await updateDoc(doc(db, "reviews", gameid), {
            [window.uid]: JSON.stringify(review),
        });
    }
    else
    {
        await setDoc(doc(db, "reviews", gameid), {
            [window.uid]: JSON.stringify(review),
        });
    }
    location.reload();
}

function createReview(uid, stars, body) {
    let review = document.createElement('div');
    let star_icon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"22\" height=\"22\" fill=\"yellow\" class=\"bi bi-star-fill\" viewBox=\"0 0 16 16\"><path d=\"M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z\"/></svg>\n";
    let stars_html = "";
    for (let i = 0; i < stars; i++) {
        stars_html += star_icon;
    }
    review.innerHTML = "<div class=\"row-auto review-container\">\n" +
        "                    <div class=\"col-sm-auto review-col-left\">\n" +
        "                        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\" fill=\"white\" class=\"bi bi-person-circle\" viewBox=\"0 0 16 16\">\n" +
        "                            <path d=\"M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z\"/>\n" +
        "                            <path fill-rule=\"evenodd\" d=\"M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z\"/>\n" +
        "                        </svg>\n" +
        "                    </div>\n" +
        "                    <div class=\"col-sm review-col-right\">\n" +
        "                        <div class=\"review-header\">\n" +
        "                            <h3 class=\"review-user\">" + uid + "</h3>\n" + stars_html +
        "                        </div>\n" +
        "                        <p class-name=\"review-content\">\n" + body +
        "                        </p>\n" +
        "                    </div>\n" +
        "                </div>";
    document.getElementById('reviews').append(review);
}
