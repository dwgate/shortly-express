const queryString = require('querystring');

const parseCookies = (req, res, next) => {
  if (req.get('Cookie')) {
    let headerCookies = req.get('Cookie').replace(/ /g, '');
    let cookieObj = queryString.parse(headerCookies, ';');
    req.cookies = cookieObj;

    next();
  } else {
    req.cookies = {};
    next();
  }
};

module.exports = parseCookies;