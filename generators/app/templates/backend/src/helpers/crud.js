import httpStatus from 'http-status';
import aqp from 'api-query-params';
import Response from './response';

class CRUDController {
  constructor(model, name) {
    this._model = model;
    this._name = name;
    this.findAll = this.findAll.bind(this);
    this.create = this.create.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  async create(req, res) {
    try {
      const data = req.body;
      const result = await this._model.create(data);
      return Response.success(res, result);
    } catch (err) {
      return Response.error(res, err, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(req, res) {
    console.log('==========findAll==========', this._model.collection.name);
    try {
      const { filter, skip, limit, sort } = aqp(req.query, {
        skipKey: 'page'
      });
      const result = await this._model.paginate(filter, {
        page: skip || 1,
        limit: limit || 25,
        sort: sort
      });
      return Response.success(res, result);
    } catch (err) {
      return Response.error(res, err, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(req, res) {
    try {
      const result = await this._model.findById(req.params.id).lean();
      if (!result) {
        return Response.error(
          res,
          {
            code: `${this._name.toUpperCase()}_NOT_FOUND`,
            message: `${this._name} does not found with id ${req.params.id}`
          },
          httpStatus.NOT_FOUND
        );
      }
      return Response.success(res, result);
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return Response.error(
          res,
          {
            message: `${this._name} does not found with id ${req.params.id}`
          },
          httpStatus.NOT_FOUND
        );
      }
      return Response.error(res, err, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(req, res) {
    try {
      const result = await this._model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      );
      return Response.success(res, result);
    } catch (err) {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return Response.error(
          res,
          {
            message: `${this._name} does not found with id ${req.params.id}`
          },
          httpStatus.NOT_FOUND
        );
      }
      return Response.error(res, err, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(req, res) {
    try {
      const result = await this._model.findByIdAndRemove(req.params.id);
      return Response.success(res, result);
    } catch (err) {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return Response.error(
          res,
          {
            message: `${this._name} does not found with id ${req.params.id}`
          },
          httpStatus.NOT_FOUND
        );
      }
      return Response.error(res, err, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

export default CRUDController;
