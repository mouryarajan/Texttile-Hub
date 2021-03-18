const admin = require("firebase-admin");
// eslint-disable-next-line import/no-unresolved

exports.sendFirebaseNotification = (req, res, next) => { 
    const token = 'dyX8nfOUTfK3BFd5L8Wh1K:APA91bGHBC-d9bhlLkY57XYOauhukbow0cADYg_AFOGunrJh6Fq94MWmFTWq5aw3MMfiGaBQLTbtPJ6DvrUOnvR6Z0G2d8sP5pwhT2LhPpnCGSTjp8V6VQFQ1zxcgk-iT41e3_oBLmC0';
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