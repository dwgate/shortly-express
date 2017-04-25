const utils = require('../lib/hashUtils');
const Model = require('./model');

// Write you session database model methods here
class Sessions extends Model {
  constructor() {
    super('session');
  }

  create() {
    // return super.create.call(this, )
  }
}

module.exports = new Sessions();