const utils = require('../lib/hashUtils');
const Model = require('./model');

// Write you session database model methods here
class Sessions extends Model {
  constructor() {
    super('sessions');
  }

  isValidSession(userAgent, shortlyId) {

    return this.get( {hash: shortlyId} ) 
    .then( session => {
      if ( !session ) {
        return null;
      }

      let sessionHash = utils.sha256(userAgent, session.salt);
      let matchedHash = sessionHash === shortlyId;
      let expired = ( new Date() - session.timestamp > 600000 );

      if ( expired || !matchedHash ) {
        this.delete( {id: session.id} )
        .then( () => {
          return null;
        });
      }

      return session;
    });
  }

  // creates a sessions table record based on userAgent string
  // returns a promise, resolved with an object containing the created session record
  createSession( userAgent ) {
    let now = new Date();
    let salt = utils.createSalt();
    let hash = utils.sha256(userAgent, salt);

    let sessionInfo = {
      hash: hash,
      timestamp: now,
      salt: salt
    };

    return super.create.call(this, sessionInfo)
    .then( (createResult) => {
      return this.get({ id: createResult.insertId });
    });
  }
}

module.exports = new Sessions();





