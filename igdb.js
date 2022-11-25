import { getUsernames } from "./firestore.js";

const client_id = '8e0xehum0rc98q93en6q8kpl70n1tl';
const client_secret = '8xa5e1libr9d1b7zzzviwc8uu39l69';
let access_token = null;
window.gameid = new URLSearchParams(window.location.search).get('id');

axios({
    method: 'post',
    url: 'https://id.twitch.tv/oauth2/token',
    params: {
        client_id: client_id,
        client_secret: client_secret,
        grant_type: 'client_credentials'
    }
}).then(function (response) {
    access_token = response.data.access_token;
    setup();
    searchIt();
}).catch(function (error) {
    console.log(error);
});

function setup()
{
    if (location.pathname.split("/").slice(-1) == 'home.html')
    {
        getGames('fields id; sort rating_count desc; limit 5; where rating_count != null;').then(function(cover_id) {
            for (let i = 0; i < cover_id.length; i++)
            {
                getCoverByGameId(cover_id[i].id).then(function(url) {
                    document.getElementById('pic' + i).src = url;
                    document.getElementById("imageLink" + i).href = 'game.html?id=' + cover_id[i].id;
                })
            }
        }).catch(function(error) {
            console.log(error);
        });
    }
    else if (location.pathname.split("/").slice(-1).includes('game.html'))
    {
        genericRequest('https://api.igdb.com/v4/games/', 'fields *; where id = ' + gameid + ';').then(function(response) {
            document.getElementById('title').innerHTML = response[0].name + document.getElementById('title').innerHTML;
            document.getElementById('description').innerHTML = response[0].summary;
            document.getElementById('release').innerHTML = new Date(response[0].first_release_date * 1000).toDateString();

            let platforms = [];
            let platform_count = response[0].platforms.length;
            for (let i = 0; i < platform_count; i++)
            {
                genericRequest('https://api.igdb.com/v4/platforms', 'fields *; where id = ' + response[0].platforms[i] + ';').then(function(response) {
                    platforms.push(response[0].name);
                    if (platforms.length >= platform_count)
                    {
                        document.getElementById('platforms').innerHTML = platforms[0];
                        for (let j = 1; j < platforms.length; j++)
                        {
                            document.getElementById('platforms').innerHTML += "<br>" + platforms[j];
                        }
                    }
                });
            }

            getCoverByGameId(response[0].id).then(function(response) {
                document.getElementById('cover').src = response;
            });

            for (let i = 0; i < response[0].screenshots.length; i++)
            {
                genericRequest('https://api.igdb.com/v4/screenshots', 'fields url; where id = ' + response[0].screenshots[i] + ';').then(async function (response) {
                    const img = document.createElement("img");
                    img.src = response[0].url.replace("t_thumb", "t_screenshot_big");
                    img.style.maxHeight = '300px';
                    img.style.marginRight = '10px';
                    img.style.marginLeft = '10px';
                    flkty.append(img);
                    img.onload = function () {
                        flkty.resize();
                    }
                    await setFavoriteIcon(document.getElementById("title").innerHTML);
                    await setCurrentIcon(document.getElementById("title").innerHTML);
                });
            }
        });
    }
    if (location.pathname.split("/").slice(-1) == 'user.html'){
        document.getElementById("displayName").innerHTML = new URLSearchParams(window.location.search).get('name');
    }
}


window.searchIt = async function(){
    let totalItems = 0;
    if (location.pathname.split("/").slice(-1) == 'home.html' || location.pathname.split("/").slice(-1) == 'game.html' || location.pathname.split("/").slice(-1) == 'profile.html' || location.pathname.split("/").slice(-1) == 'user.html')
    {
        await getGames('fields id, name; limit 10; search \"' + document.getElementById("searchTerm").value + '\";').then(function(gameList) {
            let i = 0;
            if(gameList.length == 0){
                document.getElementById("games").style.display = "none";
            }
            else{
                document.getElementById("games").style.display = "block";
            }
            totalItems += gameList.length;
            for (i; i < gameList.length; i++)
            {
                document.getElementById("gameName" + i).style.display = "block";
                document.getElementById("gameName" + i).innerHTML = gameList[i].name;
                document.getElementById("gameName" + i).href = 'game.html?id=' + gameList[i].id;
            }
            for(i; i < 10; i++){
                document.getElementById("gameName" + i).style.display = "none";
            }
            
        }).catch(function(error) {
            console.log(error);
        });
        await getUsernames(document.getElementById("searchTerm").value).then(function(userList) {
            let i = 0;
            if(userList.length == 0){
                document.getElementById("users").style.display = "none";
            }
            else{
                document.getElementById("users").style.display = "block";
            }
            totalItems += userList.length;
            for (i; i < userList.length && i < 5; i++)
            {
                if((userList[i]).includes(document.getElementById("searchTerm").value)){
                document.getElementById("username" + i).style.display = "block";
                document.getElementById("username" + i).innerHTML = userList[i];
                document.getElementById("username" + i).href = 'user.html?name=' + userList[i];
                }
                else{
                    document.getElementById("username" + i).style.display = "none";
                }
            }
            for(i; i < 5; i++){
                document.getElementById("username" + i).style.display = "none";
            }
            if(totalItems == 0){
                document.getElementById("noMatchesHolder").style.display = "block";
            }
            else{
                document.getElementById("noMatchesHolder").style.display = "none";
            }
        }).catch(function(error) {
            console.log(error);
        });
    }
}

window.genericRequest = async function(endpoint, body)
{
    return new Promise((resolve, reject) => {
        axios({
            url: "http://coms-319-007.class.las.iastate.edu:8080/" + endpoint,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': client_id,
                'Authorization': 'Bearer ' + access_token
            },
            data: body
        }).then(function(response) {
            resolve(response.data);
        }).catch(function(error) {
            reject(error);
        })
    });
}

window.getGames = async function(body)
{
    return new Promise((resolve, reject) => {
        axios({
            url: "http://coms-319-007.class.las.iastate.edu:8080/https://api.igdb.com/v4/games/",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': client_id,
                'Authorization': 'Bearer ' + access_token
            },
            data: body
        }).then(function(response) {
            resolve(response.data);
        }).catch(function(error) {
            reject(error);
        })
    });
}


window.getCoverByGameId = async function(id)
{
    return new Promise((resolve, reject) => {
        axios({
            url: "http://coms-319-007.class.las.iastate.edu:8080/https://api.igdb.com/v4/covers/",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': client_id,
                'Authorization': 'Bearer ' + access_token
            },
            data: 'fields url; where game = ' + id + ';'
        }).then(function(response) {
            resolve('https:' + response.data[0].url.replace('t_thumb', 't_cover_big'));
        }).catch(function(error) {
            reject(error);
        })
    });
}

window.search = async function(keywords, params)
{
    return new Promise((resolve, reject) => {
        axios({
            url: "http://coms-319-007.class.las.iastate.edu:8080/https://api.igdb.com/v4/search/",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': client_id,
                'Authorization': 'Bearer ' + access_token
            },
            data: 'search \"' + keywords + '\"; ' + params
        }).then(function(response) {
            resolve(response.data);
        }).catch(function(error) {
            reject(error);
        })
    });
}

window.search = async function(keywords)
{
    return new Promise((resolve, reject) => {
        axios({
            url: "http://coms-319-007.class.las.iastate.edu:8080/https://api.igdb.com/v4/search/",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': client_id,
                'Authorization': 'Bearer ' + access_token
            },
            data: 'search \"' + keywords + '\"; fields *;'
        }).then(function(response) {
            resolve(response.data);
        }).catch(function(error) {
            reject(error);
        })
    });
}
