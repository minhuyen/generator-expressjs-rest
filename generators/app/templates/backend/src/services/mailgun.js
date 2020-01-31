import Mailgun from 'mailgun-js';
import config from '../config';
import { logger } from '../services';

export default class MailService {
  constructor() {
    this.mail = new Mailgun({
      apiKey: config.mailgun.apiKey,
      domain: config.mailgun.domain
    });
  }

  testEmail() {
    const data = {
      from: 'Call Me Now Team <me@samples.mailgun.org>',
      to: 'minhuyendo@gmail.com',
      subject: 'Hello',
      text: 'Testing some Mailgun awesomeness!'
    };

    this.mail
      .messages()
      .send(data)
      .then(body => {
        console.log(body);
      });
  }

  passwordResetEmail(to, passcode) {
    const data = {
      from: 'Call Me Now Team <noreply@kikiapp.co>',
      to: to,
      subject: 'CallMeNow Reset Password',
      // text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      // 'Please use the passcode below:\n\n' +
      // '--' + passcode + '-- \n\n' +
      // 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      html:
        '<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>' +
        '<p>Please use the passcode below:</p>' +
        '<b>' +
        passcode +
        '</b>' +
        '<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>'
    };

    this.mail
      .messages()
      .send(data)
      .then(result => {
        logger.info('==============result==========%j', result);
      })
      .catch(error => {
        logger.error('==============error==========%j', error);
      });
  }
}

// (async () => {
//   try {
//     const mailService = new MailService();
//     const result = await mailService.passwordResetEmail(
//       'minhuyendo@gmail.com',
//       '888888'
//     );
//     logger.error('==============result==========%j', result);
//   } catch (error) {
//     logger.error('==============error==========%j', error);
//   }
// })();
