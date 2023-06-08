import httpStatus from 'http-status';
import multer from 'multer';
import axios from 'axios';
import Response from '../../helpers/response';
import {
  removeFile,
  deleteS3Object,
  resizeImageS3,
  resize
} from './upload.service';
import * as storage from '../../services/storage';
import Response from '../../helpers/response';
import { removeFile } from './upload.service';

export const upload = (req, res) => {
  let image = '';
  let originalname = '';

  if (req.file) {
    image = req.file.filename;
    originalname = req.file.originalname;
  }

  Response.success(
    res,
    {
      url: `/media/${image}`,
      title: originalname
    },
    httpStatus.CREATED
  );
};

export const multiUpload = (req, res) => {
  const images = req.files.map(file => {
    return {
      url: `/media/${file.filename}`,
      title: file.originalname
    };
  });
  Response.success(res, images, httpStatus.CREATED);
}

export const uploadS3 = (req, res, next) => {
  return storage.imageUploadS3(req, res, function(error) {
    if (error instanceof multer.MulterError) {
      return Response.error(res, {
        code: error.code,
        message: error.message
      });
    } else if (error) {
      return Response.error(
        res,
        {
          message: error.message
        },
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
    try {
      let image = '';
      let originalname = '';
      let key = '';

      if (req.file) {
        console.log(req.file);
        image = req.file.location;
        originalname = req.file.originalname;
        key = req.file.key;
      }

      return Response.success(
        res,
        {
          src: image,
          title: originalname,
          key
        },
        httpStatus.CREATED
      );
    } catch (exception) {
      next(exception);
    }
  });
};

export const multiUploadS3 = (req, res, next) => {
  return storage.imagesUploadS3(req, res, function(error) {
    if (error instanceof multer.MulterError) {
      return Response.error(res, {
        code: error.code,
        message: error.message
      });
    } else if (error) {
      return Response.error(
        res,
        {
          message: error.message
        },
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
    try {
      const images = req.files.map(file => {
        return {
          src: file.location,
          title: file.originalname
        };
      });
      Response.success(res, images, httpStatus.CREATED);
    } catch (exception) {
      next(exception);
    }
  });
};

export const resizeImage = async (req, res) => {
  const { imageUrl, width, height } = req.body;
  try {
    const result = await resizeImageS3(imageUrl, width, height);
    return Response.success(res, result);
  } catch (e) {
    return Response.error(res, e);
  }
};

export const deleteFile = async (req, res) => {
  const fileName = req.params.filename;
  try {
    await removeFile(fileName);
    return Response.success(res, { message: 'File was deleted successfully!' });
  } catch (e) {
    return Response.error(res, e);
  }
};

export const deleteS3File = async (req, res) => {
  const fileName = req.params.filename;
  try {
    await deleteS3Object(fileName);
    return Response.success(res, { message: 'File was deleted successfully!' });
  } catch (e) {
    return Response.error(res, e);
  }
};

export const resizeImageStream = async (req, res, next) => {
  try {
    // Extract the query-parameter
    const widthString = req.query.width;
    const heightString = req.query.height;
    const format = req.query.format;
    const url = req.query.url;

    // Parse to integer if possible
    let width, height;
    if (widthString) {
      width = parseInt(widthString);
    }
    if (heightString) {
      height = parseInt(heightString);
    }
    // Set the content-type of the response
    res.type(`image/${format || 'png'}`);
    const readStream = await axios({ url: url, responseType: 'stream' });

    // Get the resized image
    resize(readStream, format, width, height).pipe(res);
  } catch (exception) {
    next(exception);
  }
};
