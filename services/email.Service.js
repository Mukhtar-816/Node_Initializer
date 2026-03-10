const { sendMail } = require("../config/nodemailer.js");
const templateHelper = require("../utils/templateHelper.js");

class EmailService {
    
    async send(to, subject, templateKey, data) {
        try {

            const html = templateHelper.getHtml(templateKey, data);
            
            return await sendMail(
                to,
                subject,
                subject,
                html
            );
        } catch (error) {
            console.error("Email Service Error:", error.message);
            throw error;
        }
    }
}

module.exports = new EmailService();