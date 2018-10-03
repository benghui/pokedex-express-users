var React = require("react");

class Home extends React.Component {
  render() {
    // console.log("INSIDE REACT INDEX", this.props.artists );
    const usersElements = this.props.users.map((user)=>{

    let linkPath = "/users/" + user.id;

    return (
      <li key = {user.id} style={{ listStyleType: "none" }} >
        <a href={linkPath}> {user.name}</a>
      </li>
    );
  });
    return (
      <html>
        <head />
        <body>
          <div>
            <h1>All Users</h1>
              <ul>
                {usersElements}
              </ul>
            </div>
        </body>
      </html>
    );
  }
}

module.exports = Home;
