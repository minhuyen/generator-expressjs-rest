import status from 'http-status';
import aqp from 'api-query-params';
import multer from 'multer';

import logger from '../../services/logger';
import { avatarUpload as cpUpload } from '../../services/s3';
import Response from '../../helpers/response';
import User from './users.model';

export const findAll = (req, res) => {
  const { filter, skip, limit, sort } = aqp(req.query, {
    skipKey: 'page'
  });

  User.paginate(
    filter,
    {
      page: skip || 1,
      limit: limit || 25,
      sort: sort,
      select: '-password -services -token'
    },
    function(err, data) {
      if (err) {
        return Response.error(res, err);
      } else {
        return Response.success(res, data);
      }
    }
  );
};

export const findOne = (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return Response.error(res, status.NOT_FOUND, {
          message: 'User not found with id ' + req.params.id
        });
      }
      return Response.success(res, user);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return Response.error(
          res,
          {
            message: 'User not found with id ' + req.params.id
          },
          status.NOT_FOUND
        );
      }
      return Response.error(
        res,
        {
          message: 'Error retrieving user with id ' + req.params.id
        },
        status.INTERNAL_SERVER_ERROR
      );
    });
};

export const update = (req, res) => {
  // Find user and update it with the request body
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(user => {
      if (!user) {
        return Response.error(
          res,
          {
            message: 'User not found with id ' + req.params.id
          },
          status.NOT_FOUND
        );
      }
      return Response.success(res, user);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return Response.error(
          res,
          {
            message: 'User not found with id ' + req.params.id
          },
          status.NOT_FOUND
        );
      }
      return Response.error(
        res,
        {
          message: 'Error updating user with id ' + req.params.id
        },
        status.INTERNAL_SERVER_ERROR
      );
    });
};

// Delete a user with the specified id in the request
export const deleteUser = (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => {
      if (!user) {
        return Response.error(
          res,
          {
            message: 'User not found with id ' + req.params.id
          },
          status.NOT_FOUND
        );
      }
      return Response.success(res, { message: 'User deleted successfully!' });
    })
    .catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return Response.error(
          res,
          {
            message: 'User not found with id ' + req.params.id
          },
          status.NOT_FOUND
        );
      }
      return Response.error(
        res,
        {
          message: 'Could not delete user with id ' + req.params.id
        },
        status.INTERNAL_SERVER_ERROR
      );
    });
};

export const updateAvatar = (req, res) => {
  cpUpload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      logger.error('========upload avatar multer error====== %o', err);
      return Response.error(res, err, status.INTERNAL_SERVER_ERROR);
    } else if (err) {
      // An unknown error occurred when uploading.
      logger.error('========upload avatar==error===== %o', err);
      return Response.error(res, err, status.INTERNAL_SERVER_ERROR);
    }
    const user = req.user;
    const avatar = req.file.location;
    user.avatar = avatar;
    user
      .save()
      .then(data => {
        Response.success(res, data);
      })
      .catch(err => {
        Response.error(res, err, status.INTERNAL_SERVER_ERROR);
      });
  });
};
