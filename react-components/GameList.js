class GameList extends React.Component {

    render(){


        return (
            <>
            <div id="games" class="searchHeader">
                <p id="header" class="header">====Games====</p>
            </div>
            <a id="gameName0" href="game.html" class="menuOption"></a>
            <a id="gameName1" href="game.html" class="menuOption"></a>
            <a id="gameName2" href="game.html" class="menuOption"></a>
            <a id="gameName3" href="game.html" class="menuOption"></a>
            <a id="gameName4" href="game.html" class="menuOption"></a>
            <a id="gameName5" href="game.html" class="menuOption"></a>
            <a id="gameName6" href="game.html" class="menuOption"></a>
            <a id="gameName7" href="game.html" class="menuOption"></a>
            <a id="gameName8" href="game.html" class="menuOption"></a>
            <a id="gameName9" href="game.html" class="menuOption"></a>
            <div id="users" class="searchHeader">
                <p id="noMatches" class="header">====Users====</p>
            </div>
            <a id="username0" href="user.html" class="menuOption"></a>
            <a id="username1" href="user.html" class="menuOption"></a>
            <a id="username2" href="user.html" class="menuOption"></a>
            <a id="username3" href="user.html" class="menuOption"></a>
            <a id="username4" href="user.html" class="menuOption"></a>
            <div id="noMatchesHolder" class="noMatchesHolder">
                <p id="noMatches">No matching items.</p>
            </div>
            </>
        );
    }
}
