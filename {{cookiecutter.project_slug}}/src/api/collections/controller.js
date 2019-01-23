import httpStatus from 'http-status';
import aqp from 'api-query-params';
import { validationResult } from 'express-validator/check';
import logger from '../../services/logger';
import { successResponse, errorResponse } from '../../services/response';

import Collection from './model';

export const create = (req, res) => {
  logger.info('========upload avatar multer===3=== %j', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, httpStatus.BAD_REQUEST, {
      code: 400,
      message: 'Validation errors in your request',
      errors: errors.mapped()
    });
  }
  let image = null;
  if (req.file) {
    image = req.file.location;
  }

  Collection.create({ ...req.body, image })
    .then(doc => {
      successResponse(res, httpStatus.CREATED, doc);
    })
    .catch(err => {
      errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, err);
    });
};

export const findAll = (req, res) => {
  const { filter, skip, limit, sort } = aqp(req.query);
  logger.info('===========findAll===========', filter);
  Collection.paginate(
    filter,
    {
      skip: skip || 0,
      limit: limit || 25,
      sort: sort
    },
    function(err, data) {
      if (err) {
        return errorResponse(res, httpStatus.BAD_REQUEST, { message: err });
      } else {
        res.status(httpStatus.OK);
        var results = {
          success: true,
          data: data.docs,
          total: data.total,
          limit: data.limit,
          page: data.page,
          pages: data.pages
        };
        return res.json(results);
      }
    }
  );
};

export const findById = (req, res) => {
  Collection.findById(req.params.id)
    .then(doc => {
      if (!doc) {
        return errorResponse(res, httpStatus.NOT_FOUND, {
          message: 'Collection not found with id ' + req.params.id
        });
      }
      successResponse(res, httpStatus.OK, doc);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return errorResponse(res, httpStatus.NOT_FOUND, {
          message: 'Collection not found with id ' + req.params.id
        });
      }
      return errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {
        message: 'Error retrieving collection with id ' + req.params.id
      });
    });
};

export const update = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    Object.keys(req.body).forEach(key => {
      collection[key] = req.body[key];
    });
    return successResponse(res, httpStatus.OK, await collection.save());
  } catch (e) {
    return errorResponse(res, httpStatus.BAD_REQUEST, { message: e });
  }
};

export const remove = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    await collection.remove();
    return successResponse(res, httpStatus.OK, {
      message: 'Collection deleted successfully!'
    });
  } catch (e) {
    return errorResponse(res, httpStatus.BAD_REQUEST, { message: e });
  }
};
