"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var twilio_1 = __importDefault(require("twilio"));
var twilioClient = twilio_1.default(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
exports.sendSMS = function (to, body) {
    if (to.substr(0, 1) === '0') {
        to = "+82" + to.substr(1);
    }
    return twilioClient.messages.create({
        to: to,
        body: body,
        from: process.env.TWILIO_PHONE
    });
};
exports.sendVerificationSMS = function (to, key) { return exports.sendSMS(to, "Your verification key is : " + key); };
//# sourceMappingURL=sendSMS.js.map