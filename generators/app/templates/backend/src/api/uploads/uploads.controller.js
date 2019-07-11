import httpStatus from 'http-status';
import * as Response from '../../helpers/response';

export const upload = (req, res) => {
  let image = '';

  if (req.file) {
    image = req.file.location;
  }

  Response.sucess(res, { image: image }, httpStatus.CREATED);
};
