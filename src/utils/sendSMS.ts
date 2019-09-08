import Twilio from 'twilio';

const twilioClient = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export const sendSMS = (to:string, body:string) => {
  if (to.substr(0, 1) === '0') {
    to = `+82${to.substr(1)}`;
  }
  return twilioClient.messages.create({
    to,
    body,
    from: process.env.TWILIO_PHONE
  });
};

export const sendVerificationSMS = (to:string, key:string) => sendSMS(to, `Your verification key is : ${key}`);
