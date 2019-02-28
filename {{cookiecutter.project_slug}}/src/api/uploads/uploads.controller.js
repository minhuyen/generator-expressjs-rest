import httpStatus from 'http-status';
import { successResponse } from '../../services/response';

export const upload = (req, res) => {
  let image = '';

  if (req.file) {
    image = req.file.location;
  }

  successResponse(res, httpStatus.CREATED, { image: image });
};
