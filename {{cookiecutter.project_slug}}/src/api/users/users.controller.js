import status from 'http-status';
import aqp from 'api-query-params';
import multer from 'multer';
import { validationResult } from 'express-validator/check';

import logger from '../../services/logger';
import { avatarUpload as cpUpload } from '../../services/s3';
import User from './users.model';

export const findAll = (req, res) => {
  const { filter, skip, limit, sort } = aqp(req.query);
  logger.info('===========findAll===========', filter);
  User.paginate(
    filter,
    {
      skip: skip || 0,
      limit: limit || 25,
      sort: sort,
      select: '-password -services -token'
    },
    function(err, data) {
      if (err) {
        res.status(status.BAD_REQUEST);
        return res.json(err);
      } else {
        res.status(status.OK);
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

export const findOne = (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(status.NOT_FOUND).json({
          message: 'User not found with id ' + req.params.id
        });
      }
      res.json(user);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(status.NOT_FOUND).json({
          message: 'User not found with id ' + req.params.id
        });
      }
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving user with id ' + req.params.id
      });
    });
};

export const update = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = errors.array({ onlyFirstError: true });
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: error
    });
  }

  // Find user and update it with the request body
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(user => {
      if (!user) {
        return res.status(status.NOT_FOUND).json({
          message: 'User not found with id ' + req.params.id
        });
      }
      res.json(user);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(status.NOT_FOUND).json({
          message: 'User not found with id ' + req.params.id
        });
      }
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating user with id ' + req.params.id
      });
    });
};

// Delete a user with the specified id in the request
export const deleteUser = (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(status.NOT_FOUND).json({
          message: 'User not found with id ' + req.params.id
        });
      }
      res.json({ message: 'User deleted successfully!' });
    })
    .catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(status.NOT_FOUND).json({
          message: 'User not found with id ' + req.params.id
        });
      }
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'Could not delete user with id ' + req.params.id
      });
    });
};

export const updateAvatar = (req, res) => {
  cpUpload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      logger.error('========upload avatar multer error====== %o', err);
      return res.status(status.INTERNAL_SERVER_ERROR).json({ errors: err });
    } else if (err) {
      // An unknown error occurred when uploading.
      logger.error('========upload avatar==error===== %o', err);
      return res.status(status.INTERNAL_SERVER_ERROR).json({ errors: err });
    }
    const user = req.user;
    const avatar = req.file.location;
    user.avatar = avatar;
    user
      .save()
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(status.INTERNAL_SERVER_ERROR).json(err);
      });
  });
};
