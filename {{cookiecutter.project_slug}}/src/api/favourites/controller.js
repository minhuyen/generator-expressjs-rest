import httpStatus from 'http-status';
import aqp from 'api-query-params';

import logger from '../../services/logger';
import Favourite from './model';

export const create = async (req, res) => {
  const user = req.user;
  try {
    const favourite = await Favourite.create({
      ...req.body,
      owner: user._id
    });
    return res.status(httpStatus.CREATED).json(favourite);
  } catch (e) {
    return res.status(httpStatus.BAD_REQUEST).json(e);
  }
};

export const findAll = (req, res) => {
  const { filter, skip, limit, sort } = aqp(req.query);
  logger.info('===========findAll===========', filter);
  const user = req.user;
  let roleFilter = filter;
  if (user.role !== 'admin') {
    roleFilter = { ...filter, owner: user._id };
  }
  Favourite.paginate(
    roleFilter,
    {
      skip: skip || 0,
      limit: limit || 25,
      sort: sort
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
  Favourite.findById(req.params.id)
    .then(doc => {
      if (!doc) {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Favourite not found with id ' + req.params.id
        });
      }
      res.json(doc);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(httpStatus.NOT_FOUND).json({
          message: 'Favourite not found with id ' + req.params.id
        });
      }
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving favourite with id ' + req.params.id
      });
    });
};

export const update = async (req, res) => {
  try {
    const favourite = await Favourite.findById(req.params.id);
    Object.keys(req.body).forEach(key => {
      favourite[key] = req.body[key];
    });
    return res.status(httpStatus.OK).json(await favourite.save());
  } catch (e) {
    return res.status(httpStatus.BAD_REQUEST).json(e);
  }
};

export const remove = async (req, res) => {
  try {
    const favourite = await Favourite.findById(req.params.id);
    await favourite.remove();
    return res.sendStatus(httpStatus.OK);
  } catch (e) {
    return res.status(httpStatus.BAD_REQUEST).json(e);
  }
};
