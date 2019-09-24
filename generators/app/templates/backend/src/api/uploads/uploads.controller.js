import httpStatus from 'http-status';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import Response from '../../helpers/response';

export const upload = (req, res) => {
  let image = '';

  if (req.file) {
    console.log('file:  ', req.file);
    image = req.file.filename;
  }

  Response.success(res, { image: image }, httpStatus.CREATED);
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
