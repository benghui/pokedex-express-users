var React = require("react");

class Pokemon extends React.Component {
  render() {
    // console.log("INSIDE REACT INDEX", this.props.user_pokemon);
    // console.log("INSIDE REACT INDEX", this.props.pokemon);

    const element = this.props.user_pokemon.map(user_pokemon => {
      let linkPath = "/users/" + user_pokemon.id;

      return(
        <li key = {user_pokemon.id} style={{ listStyleType: "none" }} >
          <a href={linkPath}> {user_pokemon.user_name}</a>
        </li>
      );
    });
    return (
      <html>
        <head />
        <body>
          <div>
            <ul className="pokemon-list">
              <li className="pokemon-attribute" style={{ listStyleType: "none" }}>
                <b>id:</b> {this.props.pokemon[0].id}
              </li>
              <li className="pokemon-attribute" style={{ listStyleType: "none" }}>
                <b>name:</b> {this.props.pokemon[0].name}
              </li>
              <li className="pokemon-attribute" style={{ listStyleType: "none" }}>
                <b>height:</b> {this.props.pokemon[0].height}
              </li>
              <li className="pokemon-attribute" style={{ listStyleType: "none" }}>
                <b>weight:</b> {this.props.pokemon[0].weight}
              </li>
              <li className="pokemon-attribute" style={{ listStyleType: "none" }}>
                <img src = {this.props.pokemon[0].img} alt = {this.props.pokemon[0].name}/>
              </li>
              <p>This pokemon has been captured by: </p>
              {element}
            </ul>
          </div>
        </body>
      </html>
    );
  }
}

module.exports = Pokemon;
