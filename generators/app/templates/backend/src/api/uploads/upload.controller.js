import httpStatus from 'http-status';
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
