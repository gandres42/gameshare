
class GameCollections extends React.Component {


    render(){
  
        return (
          React.createElement(
            "div",
            null,
            this.props.games.map(function (game) {
                return React.createElement(
                    "a",
                    { href: "/game.html?id=" + game[1], class: "menuOption" },
                    game[0]
                );
            })))
        
    }
  
  }
  
  
  
  export default GameCollections;
