import { FCMNotificationPayload } from '../interface';

async function sendNotification(
  token: string,
  payload: FCMNotificationPayload,
) {
  try {
    console.log('Sending FCM notification');

    console.log('FCM notification sent');
  } catch (err) {
    console.error('[SEND-FCM-NOTIFICATION-ERROR] : ', err);
  }
}

export default {
  sendNotification,
};
