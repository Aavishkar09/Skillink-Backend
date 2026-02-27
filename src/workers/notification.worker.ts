import "dotenv/config"; // Add this at the top
import {Worker} from "bullmq";
import fs from "fs";
import path from "path";
import {redisConnection } from "../config/redis";
import {transporter} from "../config/mailer"
import {emailNotificationPayload} from "../types/notification.types"

new Worker<emailNotificationPayload>(
    "notification",
    async(job) => {
        try {
            console.log("Processing job:", job.data);
            const {to, subject, template, data} = job.data;
            
            const templatePath = path.join(
                process.cwd(),
                "src",
                "templates", 
                template
            );
            
            console.log("Template path:", templatePath);
            
            let html = fs.readFileSync(templatePath, "utf-8");
            for (const key in data) {
                html = html.replace(
                    new RegExp(`{{${key}}}`, "g"),
                    data[key]
                );
            }
            
            const result = await transporter.sendMail({
                from: `"My App" <${process.env.MAIL_USER}>`,
                to,
                subject,
                html
            });
            
            console.log("Email sent:", result.messageId);
        } catch (error) {
            console.error("Worker error:", error);
            throw error;
        }
    },
    {connection: redisConnection}
);

