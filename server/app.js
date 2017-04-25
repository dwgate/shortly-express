const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const Auth = require('./middleware/auth');
const cookieParser = require('./middleware/cookieParser');//added this middleware
const models = require('./models'); 

const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from ../public directory
app.use(express.static(path.join(__dirname, '../public')));

// app.use(Auth.auth);
app.use(cookieParser);
//added this middleware - would assume we have to check for cookies every req.
//need to determine how we assign cookies - thinking "timestamp" hash? - compromises security

app.get('/', 
(req, res) => {
  res.render('index');
});

app.get('/create', 
(req, res) => {
  res.render('index');
});

app.get('/links', 
(req, res, next) => {
  models.Links.getAll()
    .then(links => {
      res.status(200).send(links);
    })
    .error(error => {
      res.status(500).send(error);
    });
});

app.post('/links', 
(req, res, next) => {
  var url = req.body.url;
  if (!models.Links.isValidUrl(url)) {
    // send back a 404 if link is not valid
    return res.sendStatus(404);
  }

  return models.Links.get({ url })
    .then(link => {
      if (link) {
        throw link;
      }
      return models.Links.getUrlTitle(url);
    })
    .then(title => {
      return models.Links.create({
        url: url,
        title: title,
        baseUrl: req.headers.origin
      });
    })
    .then(results => {
      return models.Links.get({ id: results.insertId });
    })
    .then(link => {
      throw link;
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(link => {
      res.status(200).send(link);
    });
});

app.post('/signup', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  //check if username exists in user database
  return models.Users.get({ username }) 
    .then(user => {
      if (user) {
        throw user;
      }
      return models.Users.create(username, password);
    })
    .then(() => {
      res.redirect('/');
    })
    .catch( user => 
      res.redirect('/signup')
    );
});


/************************************************************/
// Write your authentication routes here
/************************************************************/
app.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  // check if this user is in our database
    // if not, redirect to /login 
  return models.Users.get({ username })

    .then( rows => {
      if ( rows === undefined ) {
        throw 'user not found';
      }
      return models.Users.authenticateUser( username, password );

    }).then( isAuthenticated => {
      if ( isAuthenticated ) {
        res.redirect( '/' );
      } else {
        throw 'invalid password';
      }
    }).error( err => {
      console.error( err );
      res.status(500).send(err);
    }).catch( err => {
      res.redirect( '/login' );
    });
});
/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
