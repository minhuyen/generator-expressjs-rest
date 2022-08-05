import mime from 'mime';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
// import multerS3 from 'multer-s3';
// import aws from 'aws-sdk';

// import config from '../config';

// const s3 = new aws.S3({
//   accessKeyId: config.aws.accessKeyId,
//   secretAccessKey: config.aws.secretAccessKey
// });

// const s3Storage = multerS3({
//   s3: s3,
//   bucket: config.aws.bucketName,
//   acl: 'public-read',
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   metadata: function(req, file, cb) {
//     cb(null, { fieldName: file.fieldname });
//   },
//   key: function(req, file, cb) {
//     crypto.pseudoRandomBytes(16, function(err, raw) {
//       cb(
//         null,
//         raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype)
//       );
//     });
//   }
// });

const localStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    const uploadFolder = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }
    callback(null, uploadFolder);
  },
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      cb(
        null,
        raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype)
      );
    });
  }
});

const upload = multer({ storage: localStorage });

export const avatarUpload = upload.single('avatar');

export const imageUpload = upload.single('image');
export const photosUpload = upload.array('photos', 12);
export const fileUpload = upload.single('file');

