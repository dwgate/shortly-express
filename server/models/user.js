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
      let hashedPassword = utils.sha256( password, this.formatTimestamp(user.timestamp) );
      return ( hashedPassword === user.password );
    });
  }

  create(username, password) {
    let now = new Date();
    let timestamp = this.formatTimestamp( now );

    let userInfo = {
      username: username,
      password: utils.sha256(password, timestamp),
      timestamp: timestamp
    };
    return super.create.call(this, userInfo);
  }
}

module.exports = new Users();