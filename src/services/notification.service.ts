import { notificationQueue } from "../queue/notificatioQueue";
import { emailNotificationPayload } from "../types/notification.types";

export const sendMailNotification = async(
    payload:emailNotificationPayload
): Promise<void> => {
    await notificationQueue.add("email",payload,{
        attempts: 3,
        backoff: {
            delay:2000,
            type:"exponential"
        },
        removeOnComplete: true,
        removeOnFail: false,
    });
};