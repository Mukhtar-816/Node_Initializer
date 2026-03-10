const templateHelper = {
    templates: {
        // 1. OTP / Registration Verification
        otp: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 12px; background-color: #ffffff;">
                <h2 style="color: #007bff; margin-top: 0;">Verification Code</h2>
                <p style="color: #555; line-height: 1.5;">Hello <strong>{{name}}</strong>,</p>
                <p style="color: #555; line-height: 1.5;">Thank you for joining <strong>{{brand}}</strong>. Please use the following One-Time Password (OTP) to verify your account:</p>
                <div style="background: #f8f9fa; padding: 25px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #333; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
                    {{otp}}
                </div>
                <p style="font-size: 13px; color: #dc3545;"><strong>Note:</strong> This code expires in {{expiry}}.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">
                <footer style="font-size: 11px; color: #aaa; text-align: center;">&copy; {{year}} {{brand}}. If you did not request this, please ignore this email.</footer>
            </div>`,

        // 2. Email Verification Success (Welcome)
        verificationSuccess: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 12px; background-color: #ffffff; text-align: center;">
                <div style="font-size: 50px; color: #28a745; margin-bottom: 10px;">✔</div>
                <h2 style="color: #28a745; margin-top: 0;">Account Verified!</h2>
                <p style="color: #555; line-height: 1.5;">Hi <strong>{{name}}</strong>,</p>
                <p style="color: #555; line-height: 1.5;">Your email has been successfully verified. You now have full access to your <strong>{{brand}}</strong> account.</p>
                <div style="margin: 30px 0;">
                    <a href="{{loginUrl}}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
                </div>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">
                <footer style="font-size: 11px; color: #aaa;">&copy; {{year}} {{brand}}.</footer>
            </div>`,

        // 3. Security Alert (Token Reuse or New Login)
        securityAlert: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 500px; margin: auto; border: 2px solid #dc3545; padding: 30px; border-radius: 12px; background-color: #ffffff;">
                <h2 style="color: #dc3545; margin-top: 0;">⚠️ Security Alert</h2>
                <p style="color: #555;">Hello <strong>{{name}}</strong>,</p>
                <p style="color: #555;">We detected an unusual activity on your account. As a precaution, your active sessions have been managed.</p>
                <div style="background: #fff5f5; padding: 15px; border-radius: 6px; border-left: 4px solid #dc3545; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #333;"><strong>Details:</strong> {{details}}</p>
                </div>
                <p style="color: #555; font-size: 14px;">If this was not you, please reset your password immediately to secure your account.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">
                <footer style="font-size: 11px; color: #aaa; text-align: center;">&copy; {{year}} {{brand}}.</footer>
            </div>`,

        // 4. General Notification (Generic)
        notification: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 12px; background-color: #ffffff;">
                <h2 style="color: #333; margin-top: 0;">{{subject}}</h2>
                <p style="color: #555; line-height: 1.6;">Hi {{name}},</p>
                <p style="color: #555; line-height: 1.6;">{{message}}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">
                <footer style="font-size: 11px; color: #aaa; text-align: center;">&copy; {{year}} {{brand}}.</footer>
            </div>`
    },

    /**
     * @description Compiles the selected template with provided data.
     * @param {string} templateKey - key of the template to use.
     * @param {Object} data - dynamic variables to inject.
     */
    getHtml: (templateKey, data = {}) => {
        let html = templateHelper.templates[templateKey];
        if (!html) throw new Error(`Template "${templateKey}" not found.`);

        const variables = {
            brand: process.env.COMPANY_NAME || "StarterApp",
            year: new Date().getFullYear(),
            ...data
        };

        // Efficient regex-based replacement for {{variable}}
        return html.replace(/{{(\w+)}}/g, (match, key) => {
            return variables[key] !== undefined ? variables[key] : match;
        });
    }
};

module.exports = templateHelper;