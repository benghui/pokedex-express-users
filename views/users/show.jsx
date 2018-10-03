var React = require("react");

class Show extends React.Component {
  render() {
    console.log("INSIDE REACT INDEX", this.props.user_pokemon);
    const element = this.props.user_pokemon.map(user_pokemon => {
      let linkPath = "/pokemon/" + user_pokemon.id;

      return(
        <li key = {user_pokemon.id} style={{ listStyleType: "none" }} >
          <a href={linkPath}> {user_pokemon.pokemon_name}</a>
        </li>
      );
    });
    return (
      <html>
        <head />
        <body>
          <div>
            <h1>Pokemons Captured by {this.props.user_pokemon[0].user_name}</h1>
              <ul>
                {element}
              </ul>
            </div>
        </body>
      </html>
    );
  }
}

module.exports = Show;
