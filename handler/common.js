const admin = require("firebase-admin");
const jwt = require('jsonwebtoken');
const {NOTIFICATION_TYPE,NOTIFICATION_TITLE_FOR_ADMIN,NOTIFICATION_BODY_STORE_OWNER_APPROVED,NOTIFICATION_BODY_STORE_OWNER_DISAPPROVED,NOTIFICATION_BODY_FOR_ADMIN,NOTIFICATION_TITLE_STORE_OWNER} = require('./constant');
const notification = (token, title, body) => {
  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
    data: {
      notificationType:NOTIFICATION_TYPE.storeResponse
    },
  };
  admin
    .messaging()
    .send(message)
    .then((response) => {
      if (response) {
        return true;
      } else {
        return false;
      }
    })
    .catch(err => {
      return err;
    });
}

const multipleNotification = (tokenArray, userName = '') => {
  const message = {
    data: {
      title: NOTIFICATION_TITLE_FOR_ADMIN,
      body: userName+' '+NOTIFICATION_BODY_FOR_ADMIN,
      notificationType:NOTIFICATION_TYPE.storeRequest.toString() ,
    },

    tokens: tokenArray, // Array
    notification: {
      title: NOTIFICATION_TITLE_FOR_ADMIN,
      body: userName+' '+NOTIFICATION_BODY_FOR_ADMIN,
    },
    android: {
      notification: {
        channelId: "123", // String
      },
    },
    apns: {
      payload: {
        aps: {
          badge: 1,
          sound: "default",
          // Number
          "mutable-content": 1,
        },
      },
     
    },
  };
  admin // admin
    .messaging()
    .sendMulticast(message)
    .then(async (response) => {
      return true;
    })
    .catch(err => {
      // eslint-disable-next-line prefer-promise-reject-errors
      return err;
    });
}

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

const isValueExistInArray = (arr, name) => {
  const { length } = arr;
  const id = length + 1;
  const found = arr.some(el => el.username === name);
  if (!found) arr.push({ id, username: name });
  return arr;
}

const getAverage = arr => {
  if (!isEmptyObject(arr)) {
    const sum = arr.reduce((total, currentValue) => total + currentValue)
    return sum / arr.length;
  } else {
    return 0;
  }
}

module.exports = { isDefined, isEmptyObject, decodeDataFromAccessToken, isValueExistInArray, getAverage, notification ,multipleNotification};