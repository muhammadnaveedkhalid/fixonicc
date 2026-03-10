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

// Order placed & paid (e-commerce) – send confirmation to customer
export const sendOrderPlacedEmail = async (user, order) => {
    const itemsList = (order.orderItems || [])
        .map((item) => `${item.name} x${item.qty} – $${(item.qty * item.price).toFixed(2)}`)
        .join('<br/>');
    const address = order.shippingAddress
        ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
        : '–';

    const text = `Hi ${user.name},\n\nYour order has been confirmed and paid.\nOrder ID: ${order._id}\nTotal: $${order.totalPrice}\n\nThank you for shopping with Fixonic!`;
    const html = `
    <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #f1f5f9;">
        <div style="background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(10,25,47,0.08);">
            <div style="background: #0A192F; padding: 24px 32px; text-align: center;">
                <span style="display: inline-block; background: #99FF00; color: #0A192F; font-weight: 800; font-size: 18px; padding: 8px 14px; border-radius: 12px;">Fixonic</span>
                <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 12px 0 0 0;">Order confirmed</p>
            </div>
            <div style="padding: 28px 24px;">
                <p style="color: #334155; font-size: 16px; margin: 0 0 16px 0;">Hi <strong>${user.name}</strong>,</p>
                <p style="color: #334155; font-size: 16px; margin: 0 0 20px 0;">Your order has been confirmed and payment received.</p>
                <div style="background: #f1f5f9; border-radius: 12px; padding: 16px; margin: 20px 0;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Order ID</p>
                    <p style="margin: 0; font-weight: 700; color: #0A192F;">${order._id}</p>
                    <p style="margin: 16px 0 0 0; font-size: 12px; color: #64748b;">Items</p>
                    <p style="margin: 4px 0 0 0; color: #334155;">${itemsList}</p>
                    <p style="margin: 12px 0 0 0; font-size: 12px; color: #64748b;">Shipping</p>
                    <p style="margin: 4px 0 0 0; color: #334155;">${address}</p>
                    <p style="margin: 12px 0 0 0; font-size: 14px; font-weight: 700; color: #0A192F;">Total: $${order.totalPrice?.toFixed(2) || '0.00'}</p>
                </div>
                <p style="color: #64748b; font-size: 14px; margin: 0;">Thank you for shopping with Fixonic!</p>
            </div>
            <div style="padding: 16px 24px; border-top: 1px solid #f1f5f9; text-align: center;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">Fixonic – Device repair & accessories</p>
            </div>
        </div>
    </div>`;

    await sendEmail(
        user.email,
        'Order confirmed – Fixonic',
        text,
        html
    );
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
