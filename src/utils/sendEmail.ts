import Mailgun from 'mailgun-js';

const mailGunClient = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY || '',
  domain: 'gns-client.azeet.io',
});

const sendEmail = (to:string, subject:string, html:string):Promise<any> => {
  const emailData = {
    from: '관리자 admin@azeet.io',
    to,
    subject,
    html,
  };
  return mailGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (to:string, fullName:string, key:string) => {
  const emailSubject = `Hello ${fullName}, please verify your email`;
  const emailBody = `Verify your email by clicking <a href="http://nuber.com/verification/${key}">here</a>`;
  return sendEmail(to, emailSubject, emailBody);
};