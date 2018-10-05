var React = require("react");

class New extends React.Component {
  render() {
    return (
      <html>
        <head />
        <body>
          <form method="POST" action="/users">
            <div>
              <h2>Create New User</h2>
              name: <input name="name" type="text" /><br/>
              password: <input name="password" type= "text" />
            </div>
            <input type="submit" value="Submit" />
          </form>
        </body>
      </html>
    );
  }
}

module.exports = New;
