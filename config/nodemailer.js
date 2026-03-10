const { createTransport } = require("nodemailer");

const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendMail = async (to, subject, text = "Mail from Dev Collab", html = "") => {
    
    const info = await transporter.sendMail({
        from: `DEV COLLAB <${process.env.USER}>`,
        to,
        subject,
        text,
        html: html || text
    });

    process.env.NODE_ENV != "PROD" && console.log("Message sent:", info.messageId);

};


module.exports =  {sendMail};