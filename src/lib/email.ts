import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export const sendClientInvitation = async ({
    email,
    name,
    coachName,
    token,
}: {
    email: string;
    name: string;
    coachName: string;
    token: string;
}) => {
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/client-setup/${token}`;

    try {
        console.log('Resend attempt starting...', { to: email, from: 'onboarding@resend.dev' });
        const data = await resend.emails.send({
            from: 'Kinetiq <onboarding@resend.dev>', // Use this for testing if your domain isn't verified yet
            to: [email],
            subject: `${coachName} wants to track your progress on Kinetiq 🎯`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
          <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -0.05em;">Kinetiq</h1>
          <p style="font-size: 18px; margin-top: 30px;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 16px; line-height: 1.6; color: #444;">
            Your coach, <strong>${coachName}</strong>, has invited you to Kinetiq to help track your fitness progress and health signals.
          </p>
          <div style="margin-top: 40px; margin-bottom: 40px;">
            <a href="${inviteUrl}" style="background-color: #111; color: #fff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Complete Your Profile
            </a>
          </div>
          <p style="font-size: 14px; color: #888; margin-top: 40px;">
            This invitation link will expire in 7 days.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 40px;" />
          <p style="font-size: 12px; color: #aaa;">
            &copy; ${new Date().getFullYear()} Kinetiq AI. All rights reserved.
          </p>
        </div>
      `,
        });

        console.log('Resend response data:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Email failed:', error);
        return { success: false, error };
    }
};
