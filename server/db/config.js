const Promise = require('bluebird');

module.exports = (db) => {
  if (!db.queryAsync) {
    db = Promise.promisifyAll(db);
  }

  // Create links table
  return db.queryAsync(`
    CREATE TABLE IF NOT EXISTS links (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      url VARCHAR(255),
      baseUrl VARCHAR(255),
      code VARCHAR(5),
      title VARCHAR(255),
      visits INT NOT NULL DEFAULT 0,
      timestamp TIMESTAMP,
      userId INT
    );`)
    .then(() => {
      // Create clicks table
      return db.queryAsync(`
        CREATE TABLE IF NOT EXISTS clicks (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          linkId INT,
          timestamp TIMESTAMP
        );`);
    })
  /************************************************************/
  /*          Add additional schema queries here              */
  /************************************************************/

    .then(() => {
      return db.queryAsync(`
        CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(20) NOT NULL UNIQUE,
        password CHAR(64),
        timestamp TIMESTAMP,
        salt CHAR(64)
        );`);
    })

    .then(() => {
      return db.queryAsync(`
        CREATE TABLE IF NOT EXISTS sessions (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        hash CHAR(64),
        user_id INT,
        timestamp TIMESTAMP,
        salt CHAR(64)
        );`);
    })

    .error(err => {
      console.log(err);
    });
};
