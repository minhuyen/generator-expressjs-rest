import httpStatus from 'http-status';
import { validationResult } from 'express-validator/check';
import aqp from 'api-query-params';
import logger from '../../services/logger';
import { successResponse, errorResponse } from '../../services/response';
import Recipe from './model';

export const create = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ errors: errors.mapped() });
  }

  const user = req.user;

  let image = null;

  if (req.file) {
    image = req.file.location;
  }

  Recipe.create({ ...req.body, image, owner: user._id })
    .then(doc => {
      successResponse(res, httpStatus.CREATED, doc);
    })
    .catch(err => {
      errorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, { errors: err });
    });
};

export const findAll = (req, res) => {
  const { filter, skip, limit, sort } = aqp(req.query);
  logger.info('===========findAll===========', filter);
  Recipe.paginate(
    filter,
    {
      skip: skip || 0,
      limit: limit || 25,
      sort: sort
      // populate: 'category'
    },
    function(err, data) {
      if (err) {
        res.status(httpStatus.BAD_REQUEST);
        return res.json(err);
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
  Recipe.findById(req.params.id)
    .then(doc => {
      if (!doc) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Recipe not found with id ' + req.params.id
        });
      }
      res.json(doc);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Recipe not found with id ' + req.params.id
        });
      }
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving recipe with id ' + req.params.id
      });
    });
};

export const update = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    Object.keys(req.body).forEach(key => {
      recipe[key] = req.body[key];
    });
    return res.status(httpStatus.OK).json(await recipe.save());
  } catch (e) {
    return res.status(httpStatus.BAD_REQUEST).json(e);
  }
};

export const remove = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    await recipe.remove();
    return res.sendStatus(httpStatus.OK);
  } catch (e) {
    return res.status(httpStatus.BAD_REQUEST).json(e);
  }
};
