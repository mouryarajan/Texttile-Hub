const admin = require("firebase-admin");
// eslint-disable-next-line import/no-unresolved

exports.sendFirebaseNotification = (req, res, next) => { 
    const token = 'fzt43Bz2T7GVyR65J6ERx-:APA91bFkkrF7OIvF8gvpbauT3IaUaApnNGgD9NYYtlAo6CgIciT_mpXuWUnyHB-aJOfwyPuwfLJYhmgeXfuFv6MWhfjpy77n53j9S7zqovk6W_ywfC9NRSKXfLdpbCyeokFLaUYpMM8t';
    const message = {
        token: token,
        notification: {
          title: "Hello",
          body: "Hello from backend",
        },
        data:{},
      };
    admin 
        .messaging()
        .send(message)
        .then((response) => {
          if (response) {
            res.status(200).json({
                status: true,
                data: "Succesfully sent!"
            });
          } else {
            res.status(200).json({
                status: true,
                data: "Failed to  sent!"
            });
          }
        })
        .catch(() => {
            res.status(200).json({
                status: true,
                data: "Failed to sent!"
            });
        });
}