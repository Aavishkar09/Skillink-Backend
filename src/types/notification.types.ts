export interface emailNotificationPayload{
    to: string;
    subject: string;
    template:string;
    data:Record<string, string>
}