import httpStatus from 'http-status';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import Response from '../../helpers/response';

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
};

export const deleteFile = async (req, res) => {
  const filename = req.params.filename;
  const unlink = promisify(fs.unlink);
  try {
    await unlink(path.join(__dirname, '../../../uploads', filename));
    return Response.success(res, { message: 'File was deleted successfully!' });
  } catch (e) {
    return Response.error(res, e);
  }
};
