const models = require('../models');
const Promise = require('bluebird');
const utils = require('../lib/hashUtils');

module.exports.createSession = (req, res, next) => {

  Promise.resolve( req.cookies.shortlyid )
  .then( (sessionId) => {
    if ( !sessionId ) {
      // no session cookie!
      throw sessionId;
    }

    // the client claims to have an existing session.  let's validate it
    return models.Sessions.isValidSession(req.get('User-Agent'), req.cookies.shortlyid );
  })
  .then ((session) => {
    if (!session) {
      // invalid session cookie!
      throw session;
    }

    // valid session.  grab the user info so we have the
    // necessray info to populate the session object
    req.session = session;
    return models.Users.get({id: session.user_id});
  })
  .then( (row) => {
    // populate the session object
    req.session.username = row.username;

    // update the session timestamp in the database
    let now = new Date.toString();
    return models.Sessions.update( {hash: sessionHash}, [ `timestamp = '${now}'` ] );
  })
  .then( () => {
    next();
  })
  .error( (err) => {
    console.log( err );
    res.status(500).send(err);
  })
  .catch( () => {
    // there is no valid session (because no cookies, or the
    // cookies contained an invalid session)

    // create a session!
    return models.Sessions.createSession( req.get('User-Agent') )
    .then( (session) => {
      res.cookie( 'shortlyid', session.hash );    

      req.session = {
        hash: session.hash,
      };

      next();
    })
    .catch( (err) => {
      console.error( err );
      res.status(500).send(err);
    });
  });

};