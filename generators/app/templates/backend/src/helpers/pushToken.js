import path from 'path';
import apn from 'apn';
import config from '../config';

const options = {
  token: {
    // key: path.join('cert', 'AuthKey_75Q2LF3ZYT.p8'),
    keyId: config.apn.keyId,
    teamId: config.apn.teamId
  },
  production: config.apn.production === 'true' ? true : false
};

export default class PushToken {
  constructor() {
    this.apnProvider = new apn.Provider(options);
  }

  async send(deviceToken, alert, payload) {
    const note = new apn.Notification();

    // note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    // note.badge = 1;
    // note.sound = 'ping.aiff';
    // note.alert = alert || '\uD83D\uDCE7 \u2709 You have a new message';
    note.payload = payload || {};
    note.topic = `${config.apn.topic}.voip`;
    return await this.apnProvider.send(note, deviceToken);
  }

  async sendPushNotification(deviceToken, alert, payload) {
    const note = new apn.Notification();

    note.expiry = 0; //Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    // note.badge = 1;
    note.sound = '';
    // note.alert = alert || '\uD83D\uDCE7 \u2709 You have a new message';
    note.contentAvailable = 1;
    note.payload = payload || {};
    note.pushType = 'background';
    note.topic = config.apn.topic;
    return await this.apnProvider.send(note, deviceToken);
  }
}
