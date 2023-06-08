import mime from 'mime';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import multer from 'multer';
import multerS3 from 'multer-s3';
import axios from 'axios';
import sharp from 'sharp';

import config from '../config';

const pseudoRandomBytesAsync = promisify(crypto.pseudoRandomBytes);
const S3_ACL = 'public-read';

const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  }
});

const s3Storage = multerS3({
  s3: s3,
  bucket: config.aws.bucketName,
  acl: S3_ACL,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function(req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      cb(
        null,
        raw.toString('hex') +
          Date.now() +
          '.' +
          mime.getExtension(file.mimetype)
      );
    });
  }
});

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
        raw.toString('hex') +
          Date.now() +
          '.' +
          mime.getExtension(file.mimetype)
      );
    });
  }
});

const generateFileName = async fileExt => {
  const raw = await pseudoRandomBytesAsync(16);
  const fileName = raw.toString('hex') + Date.now() + '.' + fileExt;
  return fileName;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage: localStorage,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});
const uploadS3 = multer({
  storage: s3Storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

export const deleteObject = async key => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: config.aws.bucketName,
      Key: key
    });
    const response = await s3.send(command);
    // console.log(response);
    return response;
  } catch (err) {
    console.error(err);
  }
};

export const uploadObject = async buffer => {
  const key = await generateFileName('png');
  const params = {
    Bucket: config.aws.bucketName,
    Key: key,
    Body: Buffer.from(buffer, 'base64'),
    ACL: S3_ACL,
    ContentType: 'image/png'
  };

  try {
    const uploadS3 = new Upload({
      client: s3,
      params: params
    });

    uploadS3.on('httpUploadProgress', progress => {
      console.log(progress);
    });

    return await uploadS3.done();
  } catch (err) {
    console.error(err);
  }
};

export const resizeImage = async (imageUrl, width, height) => {
  // let cachedCompositeInput = null;
  const input = (await axios({ url: imageUrl, responseType: 'arraybuffer' }))
    .data;
  return await sharp(input)
    // .composite({ input: cachedCompositeInput })
    .resize({ width: width, height: height })
    .webp({ lossless: true })
    .toBuffer();
};

export const avatarUpload = upload.single('avatar');
export const imageUpload = upload.single('image');
export const imagesUpload = upload.array('images', 12);
export const fileUpload = upload.single('file');

export const avatarUploadS3 = uploadS3.single('avatar');
export const imageUploadS3 = uploadS3.single('image');
export const imagesUploadS3 = uploadS3.array('images', 12);
export const fileUploadS3 = uploadS3.single('file');
