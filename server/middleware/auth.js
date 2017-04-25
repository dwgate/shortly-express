const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  console.log(req.headers.cookies);
  //get cookies from request object

  //if there are cookies
    //fetch them from database
      //if the cookie(hash?) and (userId  matches userName from req.body)
        //create new session


  models.Session.create();

  next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

