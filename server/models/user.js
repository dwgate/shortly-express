const utils = require('../lib/hashUtils');
const Model = require('./model');


class Users extends Model {
  constructor() {
    super('users');
  }

  // assumes username is in the database!
  authenticateUser(username, password) {
    return this.get( {username} )
    .then( user => {
      let hashedPassword = utils.sha256( password, user.salt );
      return ( hashedPassword === user.password );
    });
  }

  create(username, password) {
    let now = new Date();
    // let timestamp = this.formatTimestamp( now );
    let salt = utils.createSalt();

    let userInfo = {
      username: username,
      password: utils.sha256(password, salt),
      timestamp: now,
      salt: salt
    };
    return super.create.call(this, userInfo);
  }
}

module.exports = new Users();