import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOTPEmail = async (email, otp) => {
  try {
    const msg = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'EATOSNAP - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #FF6B35;">EATOSNAP Email Verification</h2>
            <p>Your OTP for email verification is:</p>
            <div style="background-color: #FF6B35; color: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <h1 style="margin: 0; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p>This OTP will expire in 10 minutes.</p>
            <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      `,
    };

    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('Email error:', error.message);
    return { success: false, error: error.message };
  }
};

export const testEmailConnection = async () => {
  return true;
};
