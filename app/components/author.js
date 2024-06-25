const scheduleNotification = async (notification, deviceTokenArr) => {
  const now = moment();
  const scheduledTime = moment(notification.scheduledDateAndTime);
  const delay = scheduledTime.diff(now);  // find delay b/w current time and scheduled time

  const data = {
    title: notification.title,
    description: notification.description,
    user: notification.user || "All Users",
    status: notification.status,
    scheduledDateAndTime: notification.scheduledDateAndTime,
    notificationType: "general"
  }

  if (delay > 0) {
    setTimeout(async () => {
      // const response = await fcm.sendPushNotification(
      //   deviceTokenArr,
      //   notification.title,
      //   notification.description,
      //   data
      // );
      // console.log('Notification sent:', response);
      console.log('Notification sent:');
    }, delay);
  } else {
    // const response = await fcm.sendPushNotification(
    //   deviceTokenArr,
    //   notification.title,
    //   notification.description,
    //   data
    // );
    // console.log('Notification sent:', response);
    console.log('Notification sent:');
  }
};

exports.checkAndSendNotifications = async () => {
  const now = moment();
  const fiveMinutesFromNow = moment().add(5, 'minutes');

  const notifications = await getNotifications(
    { 
      scheduledDateAndTime: {
        $gte: now.toDate(),
        $lte: fiveMinutesFromNow.toDate()
      },
      status: true,
      isDeleted: false
    }
  );
  notifications.sort((a, b) => a.scheduledDateAndTime - b.scheduledDateAndTime);  // Sort notifications
  console.log("\nnotifications", notifications);

  for (const notification of notifications) {
    const userQuery = {
      deviceToken: { $exists: true },
      isActive: true,
    };

    if (notification.user && notification.user.length > 0) {
      userQuery._id = { $in: notification.user };
    }

    const deviceTokens = await User.find(userQuery, {
      deviceToken: 1,
      name: 1,
    });

    const deviceTokenArr = deviceTokens
      .map((deviceTokenRecord) => deviceTokenRecord.deviceToken)
      .filter((token) => token && token !== "BLACKLISTED");
    console.log("deviceTokenArr", deviceTokenArr);

    if (deviceTokenArr.length > 0) {
      // const data = {
      //   title: notification.title,
      //   description: notification.description,
      //   user: notification.user || "All Users",
      //   status: notification.status,
      //   scheduledDateAndTime: notification.scheduledDateAndTime,
      //   notificationType: "general",
      // }
      // const response = await fcm.sendPushNotification(
      //   deviceTokenArr,
      //   notification.title,
      //   notification.description,
      //   data
      // );
      scheduleNotification(notification, deviceTokenArr);
      console.log("\nNotification sent:", response);
    } else {
      console.log(
        "No valid device tokens found for notification:",
        notification._id
      );
    }
  }
}
