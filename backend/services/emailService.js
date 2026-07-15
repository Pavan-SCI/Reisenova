import nodemailer from 'nodemailer';
import { Resend } from 'resend';

let resend = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

const createTransporter = () => {
  if (process.env.SMTP_HOST === 'smtp.gmail.com') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendBookingConfirmationEmail = async (userEmail, bookingType, bookingDetails) => {
  try {
    let subject = '';
    let htmlContent = '';

    if (bookingType === 'hotel') {
      subject = 'Booking Confirmation - Reisenova Travel & Tours';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #d97736;">Booking Confirmed!</h2>
          <p>Dear Traveler,</p>
          <p>Thank you for booking with <strong>Reisenova Travel & Tours</strong>. Your hotel booking has been confirmed.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Hotel Details:</h3>
            <p><strong>Hotel:</strong> ${bookingDetails.hotelDetails.name}</p>
            <p><strong>Location:</strong> ${bookingDetails.hotelDetails.location}</p>
            <p><strong>Guests:</strong> ${bookingDetails.guests || 1}</p>
          </div>
          
          <p>If you have any questions or need to make changes to your booking, please don't hesitate to contact us.</p>
          <p>Wishing you a wonderful stay!</p>
          <p>Warm regards,<br>The Reisenova Team</p>
        </div>
      `;
    } else if (bookingType === 'package') {
      subject = 'Tour Package Confirmation - Reisenova Travel & Tours';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #d97736;">Tour Package Confirmed!</h2>
          <p>Dear Traveler,</p>
          <p>Thank you for booking with <strong>Reisenova Travel & Tours</strong>. Your tour package has been confirmed.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Package Details:</h3>
            <p><strong>Package:</strong> ${bookingDetails.packageDetails.title}</p>
            <p><strong>Duration:</strong> ${bookingDetails.packageDetails.duration}</p>
          </div>
          
          <p>We are thrilled to be part of your next adventure. Our team will contact you shortly with the complete itinerary.</p>
          <p>Warm regards,<br>The Reisenova Team</p>
        </div>
      `;
    } else if (bookingType === 'vehicle') {
      subject = 'Vehicle Reservation Confirmed - Reisenova Travel & Tours';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #123524; margin: 0; font-family: serif; font-size: 28px;">Reisenova</h1>
            <p style="color: #d97736; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Travel & Tours</p>
          </div>
          <h2 style="color: #d97736; border-bottom: 2px solid #f5f5f5; padding-bottom: 10px;">Vehicle Reservation Confirmed!</h2>
          <p style="font-size: 16px; line-height: 1.5;">Dear Traveler,</p>
          <p style="font-size: 16px; line-height: 1.5;">Thank you for choosing <strong>Reisenova Travel & Tours</strong>. Your vehicle reservation has been successfully confirmed.</p>
          
          <div style="background-color: #f8fbfa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #123524;">
            <h3 style="margin-top: 0; color: #123524;">Reservation Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Vehicle:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524; font-weight: bold;">${bookingDetails.vehicleDetails?.name || 'Standard Vehicle'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Pickup Location:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524;">${bookingDetails.pickupLocation || 'To be confirmed'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Pickup Date:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524;">${bookingDetails.pickupDate || 'To be confirmed'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Drop-off Date:</strong></td>
                <td style="padding: 8px 0; text-align: right; color: #123524;">${bookingDetails.dropoffDate || 'To be confirmed'}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
            <p style="margin: 0; color: #d97736; font-weight: bold;">Our team will contact you shortly to finalize pickup arrangements.</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">If you have any questions or need to make changes to your reservation, please don't hesitate to reply to this email or contact our support team.</p>
          <p style="font-size: 16px; line-height: 1.5;">Wishing you a safe and comfortable journey!</p>
          <p style="font-size: 16px; line-height: 1.5; margin-top: 30px;">Warm regards,<br><strong style="color: #123524;">The Reisenova Team</strong></p>
        </div>
      `;
    }

    if (resend) {
      // Using Resend
      const { data, error } = await resend.emails.send({
        from: 'Reisenova Travel & Tours <onboarding@resend.dev>', // Replace with your verified domain email
        to: userEmail,
        subject: subject,
        html: htmlContent,
      });

      if (error) {
        console.error("Resend API Error:", error);
        return false;
      }
      
      console.log("Email sent via Resend:", data);
      return true;
    } else {
      // Fallback to Nodemailer
      let transporter;
      
      // Fallback to testing account if no real SMTP provided
      if (!process.env.SMTP_USER) {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      } else {
        transporter = createTransporter();
      }

      const info = await transporter.sendMail({
        from: `"Reisenova Travel & Tours" <${process.env.SMTP_USER || 'no-reply@reisenova.com'}>`,
        to: userEmail,
        subject: subject,
        html: htmlContent,
      });

      console.log("Message sent via Nodemailer: %s", info.messageId);
      
      if (!process.env.SMTP_USER) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
      return true;
    }
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};
