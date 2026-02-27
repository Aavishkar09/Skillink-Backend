import {Request, Response } from "express"
import { generateOtp, hashOTP, } from "../services/otp.service"
import {sendMailNotification} from "../services/notification.service"

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
    const {email} = req.body;

    const otp = generateOtp();
    const otpHash = await hashOTP(otp);

    await sendMailNotification({
        to: email,
        subject: "Email Verification",
        template: "otpEmail.html",
        data: {otp}
    })

    return res.status(200).json({message: `OTP sent to ${email}`, otp: otp, otpHash: otpHash});
}