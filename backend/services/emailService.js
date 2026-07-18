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

    // Generate admin notification email
    const adminEmail = 'reisenovatravels@gmail.com';
    const adminSubject = `[New Booking Alert] - ${bookingType.toUpperCase()} Reservation by ${bookingDetails.userEmail || 'User'}`;
    let adminHtmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #123524; margin: 0; font-family: serif; font-size: 28px;">Reisenova</h1>
          <p style="color: #d97736; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Admin Dashboard - New Booking Alert</p>
        </div>
        <h2 style="color: #123524; border-bottom: 2px solid #f5f5f5; padding-bottom: 10px; font-size: 20px;">New Booking Placed!</h2>
        <p style="font-size: 15px; line-height: 1.5;">Dear Admin,</p>
        <p style="font-size: 15px; line-height: 1.5;">A new booking has been placed on Reisenova Travel & Tours. Here are the user and booking details:</p>
        
        <div style="background-color: #fcf8f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97736;">
          <h3 style="margin-top: 0; color: #d97736; font-size: 16px;">Customer Information:</h3>
          <p style="margin: 5px 0; font-size: 14px;"><strong>User Email:</strong> <a href="mailto:${bookingDetails.userEmail}">${bookingDetails.userEmail || 'N/A'}</a></p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>User Phone:</strong> <span style="color: #d97736; font-weight: bold; font-size: 15px;">${bookingDetails.userPhone || bookingDetails.phone || 'N/A'}</span></p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>User ID:</strong> ${bookingDetails.userId || 'N/A'}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Booking Date/Time:</strong> ${bookingDetails.createdAt || new Date().toISOString()}</p>
        </div>

        <div style="background-color: #f8fbfa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #123524;">
          <h3 style="margin-top: 0; color: #123524; font-size: 16px;">Booking Details (${bookingType.toUpperCase()}):</h3>
    `;

    if (bookingType === 'hotel') {
      adminHtmlContent += `
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Hotel Name:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524; font-weight: bold;">${bookingDetails.hotelDetails?.name || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Location:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524;">${bookingDetails.hotelDetails?.location || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Check-In Date:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524;">${bookingDetails.checkIn || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Check-Out Date:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524;">${bookingDetails.checkOut || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Guests count:</strong></td>
              <td style="padding: 8px 0; text-align: right; color: #123524; font-weight: bold;">${bookingDetails.guests || 1}</td>
            </tr>
          </table>
      `;
    } else if (bookingType === 'package') {
      adminHtmlContent += `
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Package Title:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524; font-weight: bold;">${bookingDetails.packageDetails?.title || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Duration:</strong></td>
              <td style="padding: 8px 0; text-align: right; color: #123524;">${bookingDetails.packageDetails?.duration || 'N/A'}</td>
            </tr>
          </table>
      `;
    } else if (bookingType === 'vehicle') {
      adminHtmlContent += `
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Vehicle Name:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524; font-weight: bold;">${bookingDetails.vehicleDetails?.name || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Pickup Location:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524;">${bookingDetails.pickupLocation || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Pickup Date:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524;">${bookingDetails.pickupDate || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Drop-off Date:</strong></td>
              <td style="padding: 8px 0; text-align: right; color: #123524;">${bookingDetails.dropoffDate || 'N/A'}</td>
            </tr>
          </table>
      `;
    }

    adminHtmlContent += `
        </div>
        <p style="font-size: 13px; color: #666; text-align: center; margin-top: 30px; border-top: 1px solid #eaeaea; padding-top: 15px;">
          This is an automated notification from Reisenova System. Please check your Firestore database or admin panel for more details.
        </p>
      </div>
    `;

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
      
      console.log("Email sent via Resend to user:", data);

      // Send a copy to Reisenova Admin
      resend.emails.send({
        from: 'Reisenova Travel & Tours <onboarding@resend.dev>',
        to: adminEmail,
        subject: adminSubject,
        html: adminHtmlContent,
      }).catch(err => console.error("Resend admin notification failed", err));

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

      console.log("Message sent via Nodemailer to user: %s", info.messageId);

      // Send copy to Reisenova Admin
      transporter.sendMail({
        from: `"Reisenova Travel & Tours" <${process.env.SMTP_USER || 'no-reply@reisenova.com'}>`,
        to: adminEmail,
        subject: adminSubject,
        html: adminHtmlContent,
      }).then(adminInfo => {
        console.log("Admin notification sent via Nodemailer: %s", adminInfo.messageId);
      }).catch(err => {
        console.error("Nodemailer admin notification failed", err);
      });
      
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

export const sendTripPlanConfirmationEmail = async (userEmail, tripDetails) => {
  try {
    const subject = 'Your Customized Trip Plan Inquiry - Reisenova Travel & Tours';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #123524; margin: 0; font-family: serif; font-size: 28px;">Reisenova</h1>
          <p style="color: #d97736; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Travel & Tours</p>
        </div>
        <h2 style="color: #d97736; border-bottom: 2px solid #f5f5f5; padding-bottom: 10px;">Your Trip Planning Inquiry is Received!</h2>
        <p style="font-size: 16px; line-height: 1.5;">Dear ${tripDetails.fullName || 'Traveler'},</p>
        <p style="font-size: 16px; line-height: 1.5;">Thank you for reaching out to <strong>Reisenova Travel & Tours</strong>. We have received your customized trip planning inquiry and our local travel experts are already on it!</p>
        
        <div style="background-color: #f8fbfa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #123524;">
          <h3 style="margin-top: 0; color: #123524; font-size: 16px;">Here is a summary of your requested trip details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666; font-size: 14px;"><strong>Estimated Arrival:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524; font-size: 14px;">${tripDetails.arrivalDate || 'To be confirmed'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666; font-size: 14px;"><strong>Duration (Days):</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524; font-size: 14px;">${tripDetails.duration || 'N/A'} Days</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666; font-size: 14px;"><strong>Travelers:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524; font-size: 14px;">${tripDetails.adults || 1} Adults, ${tripDetails.children || 0} Children</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666; font-size: 14px;"><strong>Accommodation:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524; text-transform: capitalize; font-size: 14px;">${tripDetails.accommodation || 'Flexible'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666; font-size: 14px;"><strong>Estimated Budget:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524; font-size: 14px;">${tripDetails.budget || 'Flexible'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666; font-size: 14px;"><strong>Your Interests:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524; font-size: 14px;">${(tripDetails.interests && tripDetails.interests.length > 0) ? (Array.isArray(tripDetails.interests) ? tripDetails.interests.join(', ') : tripDetails.interests) : 'Flexible'}</td>
            </tr>
            ${tripDetails.additionalInfo ? `
            <tr>
              <td colspan="2" style="padding: 12px 0 0 0; color: #666; font-size: 14px;">
                <strong>Additional Info:</strong>
                <p style="margin: 5px 0 0 0; color: #333; font-style: italic; background: #fdfbf7; padding: 10px; border-radius: 5px; font-size: 14px;">${tripDetails.additionalInfo}</p>
              </td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
          <p style="margin: 0; color: #d97736; font-weight: bold; font-size: 14px;">Our team will custom-craft your perfect itinerary and respond within 24 hours!</p>
        </div>
        
        <p style="font-size: 15px; line-height: 1.5;">If you want to add more details or make any changes to this request, please feel free to reply to this email.</p>
        <p style="font-size: 15px; line-height: 1.5;">Wishing you an exciting planning journey ahead!</p>
        <p style="font-size: 15px; line-height: 1.5; margin-top: 30px;">Warm regards,<br><strong style="color: #123524;">The Reisenova Team</strong></p>
      </div>
    `;

    // Generate admin notification email
    const adminEmail = 'reisenovatravels@gmail.com';
    const adminSubject = `[New Trip Plan Inquiry] - ${tripDetails.fullName || 'User'} is Planning a Trip`;
    const adminHtmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #123524; margin: 0; font-family: serif; font-size: 28px;">Reisenova</h1>
          <p style="color: #d97736; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Admin Dashboard - Trip Planner Alert</p>
        </div>
        <h2 style="color: #123524; border-bottom: 2px solid #f5f5f5; padding-bottom: 10px; font-size: 20px;">New Trip Plan Requested!</h2>
        <p style="font-size: 15px; line-height: 1.5;">Dear Admin,</p>
        <p style="font-size: 15px; line-height: 1.5;">A new customized trip planner form has been submitted on Reisenova. Here are the user's requirements:</p>
        
        <div style="background-color: #fcf8f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d97736;">
          <h3 style="margin-top: 0; color: #d97736; font-size: 16px;">Customer Profile:</h3>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Full Name:</strong> ${tripDetails.fullName || 'N/A'}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${tripDetails.email}">${tripDetails.email || 'N/A'}</a></p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Phone/WhatsApp:</strong> <span style="color: #d97736; font-weight: bold; font-size: 15px;">${tripDetails.phone || 'N/A'}</span></p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Country:</strong> ${tripDetails.country || 'N/A'}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Submitted At:</strong> ${tripDetails.createdAt || new Date().toISOString()}</p>
        </div>

        <div style="background-color: #f8fbfa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #123524;">
          <h3 style="margin-top: 0; color: #123524; font-size: 16px;">Trip Details & Preferences:</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Estimated Arrival:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524; font-weight: bold;">${tripDetails.arrivalDate || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Duration:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524;">${tripDetails.duration || 'N/A'} Days</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Adults count:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524;">${tripDetails.adults || 1}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Children count:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524;">${tripDetails.children || 0}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Accommodation:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524; text-transform: capitalize;">${tripDetails.accommodation || 'Flexible'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Budget Level:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524;">${tripDetails.budget || 'Flexible'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; color: #666;"><strong>Interests Listed:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea; text-align: right; color: #123524; font-weight: bold;">${(tripDetails.interests && tripDetails.interests.length > 0) ? (Array.isArray(tripDetails.interests) ? tripDetails.interests.join(', ') : tripDetails.interests) : 'Flexible'}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 12px 0 0 0; color: #666;">
                <strong>Additional Info/Requirements:</strong>
                <p style="margin: 5px 0 0 0; color: #333; font-style: italic; background: #fdfbf7; padding: 12px; border-radius: 6px; font-size: 14px; border-left: 3px solid #d97736;">${tripDetails.additionalInfo || 'No special requirements listed.'}</p>
              </td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 13px; color: #666; text-align: center; margin-top: 30px; border-top: 1px solid #eaeaea; padding-top: 15px;">
          This is an automated notification from Reisenova System. Please check your Firestore database or admin panel for more details.
        </p>
      </div>
    `;

    if (resend) {
      // Send to User
      await resend.emails.send({
        from: 'Reisenova Travel & Tours <onboarding@resend.dev>',
        to: userEmail,
        subject: subject,
        html: htmlContent,
      });

      // Send to Admin
      await resend.emails.send({
        from: 'Reisenova Travel & Tours <onboarding@resend.dev>',
        to: adminEmail,
        subject: adminSubject,
        html: adminHtmlContent,
      });

      console.log("Trip planning emails sent via Resend");
      return true;
    } else {
      let transporter;
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

      // Send to User
      const info = await transporter.sendMail({
        from: `"Reisenova Travel & Tours" <${process.env.SMTP_USER || 'no-reply@reisenova.com'}>`,
        to: userEmail,
        subject: subject,
        html: htmlContent,
      });

      console.log("Trip planning email sent via Nodemailer to user: %s", info.messageId);

      // Send to Admin
      const adminInfo = await transporter.sendMail({
        from: `"Reisenova Travel & Tours" <${process.env.SMTP_USER || 'no-reply@reisenova.com'}>`,
        to: adminEmail,
        subject: adminSubject,
        html: adminHtmlContent,
      });

      console.log("Trip planning email sent via Nodemailer to Admin: %s", adminInfo.messageId);

      if (!process.env.SMTP_USER) {
        console.log("User Preview URL: %s", nodemailer.getTestMessageUrl(info));
        console.log("Admin Preview URL: %s", nodemailer.getTestMessageUrl(adminInfo));
      }
      return true;
    }
  } catch (error) {
    console.error("Error sending trip planning emails: ", error);
    return false;
  }
};
