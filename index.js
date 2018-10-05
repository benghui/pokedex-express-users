/**
 * To-do for homework on 28 Jun 2018
 * =================================
 * 1. Create the relevant tables.sql file
 * 2. New routes for user-creation
 * 3. Change the pokemon form to add an input for user id such that the pokemon belongs to the user with that id
 * 4. (FURTHER) Add a drop-down menu of all users on the pokemon form
 * 5. (FURTHER) Add a types table and a pokemon-types table in your database, and create a seed.sql file inserting relevant data for these 2 tables. Note that a pokemon can have many types, and a type can have many pokemons.
 */

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
const cookieParser = require('cookie-parser')
const sha256 = require('js-sha256');


// Initialise postgres client
const config = {
  user: 'benghui',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};

if (config.user === 'ck') {
	throw new Error("====== UPDATE YOUR DATABASE CONFIGURATION =======");
};

const pool = new pg.Pool(config);

pool.on('error', function (err) {
  console.log('Idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(cookieParser());
// app.use(sha256());


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Route Handler Functions
 * ===================================
 */

 const getRoot = (request, response) => {
  // query database for all pokemon

  // respond with HTML page displaying all pokemon
  //
  const queryString = 'SELECT * from pokemon';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      // console.log('Query result:', result.rows[0]);

      // redirect to home page
      response.render( 'pokemon/home', {pokemon: result.rows} );
    }
  });
}

const getNew = (request, response) => {
  response.render('pokemon/new');
}

const getPokemon = (request, response) => {
  let id = request.params['id'];
  let queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      queryString = 'SELECT users_pokemon.pokemon_id,users.id, users.name AS user_name, pokemon.name AS pokemon_name, pokemon.img, pokemon.weight, pokemon.height FROM users INNER JOIN users_pokemon ON (users_pokemon.user_id = users.id) INNER JOIN pokemon ON (users_pokemon.pokemon_id = pokemon.id) WHERE users_pokemon.pokemon_id =' + id + ';';
      pool.query(queryString, (inner_err, inner_result) => {
        if (inner_err) {
          console.error('Query error:', inner_err.stack);
        } else {
          // console.log('Inner Query result:', inner_result.rows);
          // console.log('Query: ', result.rows)

          response.render( 'pokemon/pokemon', {user_pokemon: inner_result.rows, pokemon: result.rows} );
        }
      });
    }
  });
}
const postPokemon = (request, response) => {
  let params = request.body;

  const queryString = 'INSERT INTO pokemon(name, img, weight, height) VALUES($1, $2, $3, $4) RETURNING *;';
  const values = [params.name, params.img, params.weight, params.height];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.log('query error:', err.stack);
    } else {
      // console.log('query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
};

const editPokemonForm = (request, response) => {
  let id = request.params['id'];
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      // console.log('Query result:', result);

      // redirect to home page
      response.render( 'pokemon/edit', {pokemon: result.rows[0]} );
    }
  });
}

const updatePokemon = (request, response) => {
  let id = request.params['id'];
  let pokemon = request.body;
  const queryString = 'UPDATE "pokemon" SET "num"=($1), "name"=($2), "img"=($3), "height"=($4), "weight"=($5) WHERE "id"=($6)';
  const values = [pokemon.num, pokemon.name, pokemon.img, pokemon.height, pokemon.weight, id];
  console.log(queryString);
  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      // console.log('Query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
}

const deletePokemonForm = (request, response) => {
  response.send("COMPLETE ME");
}

const deletePokemon = (request, response) => {
  response.send("COMPLETE ME");
}
/**
 * ===================================
 * User
 * ===================================
 */
app.get('/users', (req, res) => {


  let sqlText = "SELECT * FROM users ORDER BY id;";
  pool.query(sqlText, (error, queryResult) => {
    if (error){
    console.log('error!', error);
    res.status(500).send("DOESN'T WORK!!");
    } else{
      // console.log("ALL USERS:", queryResult.rows);
      res.render('users/home',{users: queryResult.rows});
      }
  });
});

const userNew = (request, response) => {
  response.render('users/new');
}

const userCreate = (request, response) => {
  const queryString = 'INSERT INTO users (name, hash) VALUES ($1, $2) RETURNING *';
  var hash = sha256(request.body.password)
  const values = [request.body.name, hash];
  // console.log(queryString);
  pool.query(queryString, values, (err, result) => {

    if (err) {
      console.error('Query error:', err.stack);
      response.send('dang it.');
    } else {
      console.log('CREATE result:', result);
      // console.log('CREATE RESPONSE:', response);
      // redirect to home page
      // response.cookie('loggedin', 'true');
      // response.cookie('user_id', result.rows.id) //result.rows is empty array
      response.redirect('/users/login');
    }
  });
};

const getUser = (req, res, next) => {
  console.log('GETUSER REQ', req.params.id)
  console.log ('GET USER COOKIES', req.cookies.user_id)
  console.log ("GET NEXT:", next)
  if(req.cookies.user_id === req.params.id )
    next();
    let inputId = parseInt(req.params.id);
    let sqlText = "SELECT users_pokemon.user_id, pokemon.id, users.name AS user_name, pokemon.name AS pokemon_name FROM pokemon INNER JOIN users_pokemon ON (pokemon.id = users_pokemon.pokemon_id) INNER JOIN users ON (users_pokemon.user_id = users.id) WHERE users_pokemon.user_id= ($1)";
    let values = [inputId];
    pool.query(sqlText, values, (error, queryResult) => {
    // console.log(queryResult.rows);
      if (error){
        // console.log('error!', error);
        res.status(500).send("DOESN'T WORK!!");
      } /*else if (queryResult.rows === undefined){
          res.status(404).send("User does not exist");
      }*/ else{
        // console.log(queryResult.rows);
        res.render('users/show',{user_pokemon: queryResult.rows});
      }
    });
  }
// }

const loginGet = (req, res) => {
  res.render('users/login');
};

const loginPost = (req, res) => {
  console.log("LOGIN POST", req.body);
  let username = req.body.name;
  let passwordHash = sha256(req.body.password);
  let queryString = 'SELECT * FROM users WHERE name = ($1)';
  let values = [username];
  pool.query(queryString, values, (err, result)=>{
    if (err){
      console.log ("Sign in error", err);
      res.status(401).send("Unauthorized");
    } else {
      if (result.rows.length < 1){
        console.log ("LENGTH");
        res.redirect('/users/login');
        return;
      }
      // if (passwordHash !== result.rows.hash){
      //   console.log("HASH");
      //   res.redirect('/users/login');
      //   return;
      // }
      console.log ("LOGIN RESULT", result.rows);
      res.cookie('loggedin', 'true');
      res.cookie('user_id', result.rows[0].id);

      res.redirect('/users/');
    }
  });
};

const logoutUser = (req, res) =>{
  res.clearCookie('user_id');
  res.clearCookie('loggedin');

  res.status(200).redirect('/users/login');
};
/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', getRoot);

app.get('/pokemon/new', getNew);
app.get('/pokemon/:id', getPokemon);
app.get('/pokemon/:id/edit', editPokemonForm);
app.get('/pokemon/:id/delete', deletePokemonForm);

app.post('/pokemon', postPokemon);

app.put('/pokemon/:id', updatePokemon);

app.delete('/pokemon/:id', deletePokemon);

// TODO: New routes for creating users

app.get('/users/new', userNew);
app.post('/users', userCreate);

app.get ('/users/login', loginGet); //login form user_id cookie
app.post ('/users/login', loginPost);

app.get('/users/:id', getUser); //check cookie user_id logged_in
app.get ('/users/logout', logoutUser);


app.all('*', (req, res) => {
  res.status(404).send("not found");
});

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Ahoy we go from the port of 3000!!!'));



// Handles CTRL-C shutdown
function shutDown() {
  console.log('Recalling all ships to harbour...');
  server.close(() => {
    console.log('... all ships returned...');
    pool.end(() => {
      console.log('... all loot turned in!');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
