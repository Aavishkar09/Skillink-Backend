import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";
import { emailNotificationPayload } from "../types/notification.types";

export const notificationQueue = new Queue<emailNotificationPayload>(
    "notification",
    {
        connection: redisConnection
})