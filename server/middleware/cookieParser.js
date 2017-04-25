const parseCookies = (req, res, next) => {
  if (req.cookies) {
    console.log('cookies: ', req.cookies);
    //see if we have a session for that user
      //if yes

      //if no

  } else {
    next();
  }
};

module.exports = parseCookies;