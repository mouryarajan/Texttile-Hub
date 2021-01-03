const jwt = require('jsonwebtoken');
const isDefined = (value) => {
  if (typeof value !== "undefined") {
    return true;
  }
  return false;
};
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}
const decodeDataFromAccessToken = (token) => {
  return new Promise((resolve) => {
    let tokenData = "";
    // eslint-disable-next-line consistent-return
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
      if (err) {
        console.log(err);
        return resolve(false);
      }
      tokenData = decoded;
      return resolve(tokenData);
    });
  });
};

module.exports = { isDefined, isEmptyObject, decodeDataFromAccessToken };