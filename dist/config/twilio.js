"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TwilioConfig {
}
TwilioConfig.sid = process.env.TWILLIO_SID;
TwilioConfig.key = process.env.TWILLIO_TOKEN;
TwilioConfig.smsWebhook = process.env.TWILLIO_WEBHOOK;
TwilioConfig.disableTwilioSigCheck = false;
exports.TwilioConfig = TwilioConfig;
exports.default = TwilioConfig;

//# sourceMappingURL=twilio.js.map
