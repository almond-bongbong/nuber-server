"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mailgun_js_1 = __importDefault(require("mailgun-js"));
var mailGunClient = new mailgun_js_1.default({
    apiKey: process.env.MAILGUN_API_KEY || '',
    domain: 'gns-client.azeet.io',
});
var sendEmail = function (to, subject, html) {
    var emailData = {
        from: '관리자 admin@azeet.io',
        to: to,
        subject: subject,
        html: html,
    };
    return mailGunClient.messages().send(emailData);
};
exports.sendVerificationEmail = function (to, fullName, key) {
    var emailSubject = "Hello " + fullName + ", please verify your email";
    var emailBody = "Verify your email by clicking <a href=\"http://nuber.com/verification/" + key + "\">here</a>";
    return sendEmail(to, emailSubject, emailBody);
};
//# sourceMappingURL=sendEmail.js.map