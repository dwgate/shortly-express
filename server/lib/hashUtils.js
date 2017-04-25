const crypto = require('crypto');

/************************************************************/
// Add any hashing utility functions below
/************************************************************/


const sha256 = function(input, salt) {
  const hash256 = crypto.createHash('sha256');
  hash256.update(input + salt);
  return hash256.digest('hex');
};

module.exports.sha256 = sha256;
