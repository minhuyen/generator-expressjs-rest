import status from 'http-status';
import multer from 'multer';

import logger from '../../services/logger';
import { avatarUpload as cpUpload } from '../../services/s3';
import CRUDController from '../../helpers/crud';

export default class UserController extends CRUDController {
  constructor(model, name) {
    super(model, name);
    this.updateAvatar = this.updateAvatar.bind(this);
  }

  updateAvatar(req, res) {
    cpUpload(req, res, function(err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        logger.error('========upload avatar multer error====== %o', err);
        return res.status(status.INTERNAL_SERVER_ERROR).json({ errors: err });
      } else if (err) {
        // An unknown error occurred when uploading.
        logger.error('========upload avatar==error===== %o', err);
        return res.status(status.INTERNAL_SERVER_ERROR).json({ errors: err });
      }
      const user = req.user;
      logger.error('========upload avatar file====== %o', req.file);
      const avatar = req.file.filename;
      user.avatar = avatar;
      user
        .save()
        .then(data => {
          res.json(data);
        })
        .catch(err => {
          res.status(status.INTERNAL_SERVER_ERROR).json(err);
        });
    });
  }
}
