class FriendCollection extends React.Component {


    render(){
        
        return (
          React.createElement(
            "div",
            null,
            this.props.friends.map(function (friend) {
                return React.createElement(
                    "a",
                    { href: "/user.html?name=" + friend, class: "menuOption" },
                    friend
                );
            })))
        
    }
  
  }
  
  
  
  export default FriendCollection;
