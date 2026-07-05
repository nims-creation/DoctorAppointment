import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Create a transporter
    // For development, you can use a service like Mailtrap or Gmail. 
    // In production, use SendGrid, AWS SES, or similar.
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for 587 (STARTTLS)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Define the email options
    const mailOptions = {
        from: `Prescripto <${process.env.EMAIL_USER || 'noreply@prescripto.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html // You can add HTML templates here if needed
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;
