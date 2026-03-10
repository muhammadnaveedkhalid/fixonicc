import nodemailer from 'nodemailer';

// Email Configuration
const getTransporter = () => {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send Email Function
export const sendEmail = async (to, subject, text, html) => {
    try {
        // Validation for dummy/placeholder values
        if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your-real-email') || process.env.EMAIL_USER.includes('fixonic.dummy')) {
            console.log("------------------------------------------");
            console.log("Mock Email Sent (Env not configured):");
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Message: ${text}`);
             console.log("------------------------------------------");
            return;
        }

        const transporter = getTransporter();
        
        // Verify connection before sending
        await transporter.verify();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html
        });
        console.log(`Email successfully sent to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error);
        console.error("Credentials used:", process.env.EMAIL_USER); // Log the user (safety warning: helps debug)
    }
};

// Send SMS Function (Mock for now, can integrate Twilio)
export const sendSMS = async (to, message) => {
    try {
        // Integration with Twilio or other SMS provider would go here
        // const client = require('twilio')(accountSid, authToken);
        // await client.messages.create({ body: message, from: '+1234567890', to });
        
        console.log("------------------------------------------");
        console.log("Simulating SMS Send:");
        console.log(`To: ${to}`);
        console.log(`Message: ${message}`);
        console.log("------------------------------------------");
    } catch (error) {
        console.error("Error sending SMS:", error);
    }
};

export const sendOrderConfirmation = async (user, repair) => {
    const greeting = `Greetings ${user.name},`;
    const messageBody = `Your order has been successfully placed.
Order Number: ${repair.id}
    
Thank you for choosing Fixonic! We will notify you once a vendor accepts your request.`;

    // Send Email
    await sendEmail(
        user.email, 
        'Order Confirmation - Fixonic', 
        `${greeting}\n\n${messageBody}`,
        `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0f172a;">Order Confirmation</h2>
            <p><strong>${greeting}</strong></p>
            <p>Your order has been successfully placed.</p>
            <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-size: 1.1em;"><strong>Order Number: <span style="color: #65a30d;">${repair.id}</span></strong></p>
            </div>
            <p>Thank you for choosing <strong>Fixonic</strong>! We will notify you once a vendor accepts your request.</p>
        </div>`
    );

    // Send SMS
    if (user.phoneNumber) {
        await sendSMS(user.phoneNumber, `${greeting} ${messageBody}`);
    } else {
        console.log("Skipping SMS: No phone number for user.");
    }
};
