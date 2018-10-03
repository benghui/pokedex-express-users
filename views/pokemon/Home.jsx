var React = require("react");

class Home extends React.Component {
  render() {
    // console.log(this);
    const pokemonElements = this.props.pokemon.map((pokemon)=>{

      let linkPath = "/pokemon/" + pokemon.id;
      return (
        <li key = {pokemon.id} style={{ listStyleType: "none" }} >
          <a href={linkPath}> {pokemon.name}</a>
        </li>
      );
    });
    return (
      <html>
        <head />
        <body>
          <h1>Welcome to Pokedex</h1>
          <ul>
            {pokemonElements}
          </ul>
        </body>
      </html>
    );
  }
}

module.exports = Home;
